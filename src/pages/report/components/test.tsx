export function TESTComponent({data: data, display: display}: {data: any, display?: boolean}) {
    return <>
        <button onClick={() => {
            console.log(data);
        }}>{display && "TEST"}</button>
    </>
}