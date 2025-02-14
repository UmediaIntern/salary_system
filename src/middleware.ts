import { NextResponse } from "next/server";
import { type NextRequestWithAuth, withAuth } from "next-auth/middleware";
import { accessiblePages } from "./server/api/types/access_page_type";
import { z } from "zod";
import { ParserError } from "./server/errors/parser_error";
import { MiddlewareErrorScope } from "./server/errors/error_scope";

function guardRoute(
	request: NextRequestWithAuth,
	route: string,
	access: boolean
): NextResponse | null {
	const { pathname, locale } = request.nextUrl;

	if (pathname.startsWith(route)) {
		if (access) {
			return NextResponse.rewrite(new URL(request.url));
		}
		console.log(`You cannot view ${route} page`);
		const redirectUrl = new URL(`/${locale}`, request.url);
		return NextResponse.redirect(redirectUrl);
	}
	return null;
}

const accessResponse = z.object({
	result: z.object({
		data: z.object({
			json: accessiblePages,
		}),
	}),
});

export default withAuth(
	async function middleware(request: NextRequestWithAuth) {
		/* const token = request.nextauth.token; */
		// console.log("request token", token);

		const res = await fetch(
			process.env.NEXTAUTH_URL + "/api/trpc/access.accessByRole",
			{ method: "GET", headers: request.headers }
		);

		const accessRes = await res.json();

		const parseAccessible = accessResponse.safeParse(accessRes);

		if (!parseAccessible.success) {
			console.log(parseAccessible.error);
			throw new ParserError(parseAccessible.error.toString(), MiddlewareErrorScope);
		}
		const accessible = parseAccessible.data.result.data.json;

		const guarded =
			guardRoute(request, "/functions", accessible.actions) ??
			guardRoute(request, "/parameters", accessible.actions) ??
			guardRoute(request, "/roles", accessible.roles) ??
			guardRoute(request, "/settings", accessible.settings);
		if (guarded !== null) {
			return guarded;
		}
	},
	{
		callbacks: {
			authorized: ({ token }) => {
				return !!token;
			},
		},
		// need to match the pages in auth.ts
		pages: {
			signIn: "/login",
			// signOut: '/auth/signout',
			error: "/login", // Error code passed in query string as ?error=
		},
	}
);

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 */
		"/((?!api|_next/static|_next/image|favicon.ico).*)",
	],
};
