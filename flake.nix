{
  inputs = {
    flake-utils.url = "github:numtide/flake-utils";
    nixpkgs.url = "nixpkgs/nixos-25.05";
  };

  outputs = inputs:
    inputs.flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = (import (inputs.nixpkgs) { inherit system; });
        libaioPath = pkgs.libaio;
      in {
        devShell = pkgs.mkShell {
          buildInputs = with pkgs; [
            nodejs
            yarn
            nodePackages.typescript
            nodePackages.typescript-language-server
            libaio
            libnsl
          ];

          shellHook = ''
            echo "libaio path: ${libaioPath}"
            export LD_LIBRARY_PATH="${libaioPath}/lib:$(pwd)/instantclient_12_1:$LD_LIBRARY_PATH"
          '';
        };
      }
    );
}
