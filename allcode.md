# All Code

Generated: 2026-02-19T10:21:51

## `.dev.vars.example`
```text
SILICONFLOW_API_KEY=your_siliconflow_api_key
SILICONFLOW_MODEL=deepseek-ai/DeepSeek-V3.2
SILICONFLOW_BASE_URL=https://api.siliconflow.cn/v1
```

## `.gitignore`
```text
node_modules/
.wrangler/
.dev.vars
dist/
*.log
.env
.env.*
!.env.example
.DS_Store
*.swp
*.swo
export_all_code.py
```

## `package-lock.json`
```json
{
  "name": "werewolf-worker",
  "version": "0.1.0",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "werewolf-worker",
      "version": "0.1.0",
      "dependencies": {
        "openai": "^6.4.0"
      },
      "devDependencies": {
        "@cloudflare/workers-types": "^4.20260218.0",
        "typescript": "^5.9.2",
        "wrangler": "^4.43.0"
      }
    },
    "node_modules/@cloudflare/kv-asset-handler": {
      "version": "0.4.2",
      "resolved": "https://registry.npmjs.org/@cloudflare/kv-asset-handler/-/kv-asset-handler-0.4.2.tgz",
      "integrity": "sha512-SIOD2DxrRRwQ+jgzlXCqoEFiKOFqaPjhnNTGKXSRLvp1HiOvapLaFG2kEr9dYQTYe8rKrd9uvDUzmAITeNyaHQ==",
      "dev": true,
      "license": "MIT OR Apache-2.0",
      "engines": {
        "node": ">=18.0.0"
      }
    },
    "node_modules/@cloudflare/unenv-preset": {
      "version": "2.13.0",
      "resolved": "https://registry.npmjs.org/@cloudflare/unenv-preset/-/unenv-preset-2.13.0.tgz",
      "integrity": "sha512-bT2rnecesLjDBHgouMEPW9EQ7iLE8OG58srMuCEpAGp75xabi6j124SdS8XZ+dzB3sYBW4iQvVeCTCbAnMMVtA==",
      "dev": true,
      "license": "MIT OR Apache-2.0",
      "peerDependencies": {
        "unenv": "2.0.0-rc.24",
        "workerd": "^1.20260213.0"
      },
      "peerDependenciesMeta": {
        "workerd": {
          "optional": true
        }
      }
    },
    "node_modules/@cloudflare/workerd-darwin-64": {
      "version": "1.20260217.0",
      "resolved": "https://registry.npmjs.org/@cloudflare/workerd-darwin-64/-/workerd-darwin-64-1.20260217.0.tgz",
      "integrity": "sha512-t1KRT0j4gwLntixMoNujv/UaS89Q7+MPRhkklaSup5tNhl3zBZOIlasBUSir69eXetqLZu8sypx3i7zE395XXA==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">=16"
      }
    },
    "node_modules/@cloudflare/workerd-darwin-arm64": {
      "version": "1.20260217.0",
      "resolved": "https://registry.npmjs.org/@cloudflare/workerd-darwin-arm64/-/workerd-darwin-arm64-1.20260217.0.tgz",
      "integrity": "sha512-9pEZ15BmELt0Opy79LTxUvbo55QAI4GnsnsvmgBxaQlc4P0dC8iycBGxbOpegkXnRx/LFj51l2zunfTo0EdATg==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">=16"
      }
    },
    "node_modules/@cloudflare/workerd-linux-64": {
      "version": "1.20260217.0",
      "resolved": "https://registry.npmjs.org/@cloudflare/workerd-linux-64/-/workerd-linux-64-1.20260217.0.tgz",
      "integrity": "sha512-IrZfxQ4b/4/RDQCJsyoxKrCR+cEqKl81yZOirMOKoRrDOmTjn4evYXaHoLBh2PjUKY1Imly7ZiC6G1p0xNIOwg==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=16"
      }
    },
    "node_modules/@cloudflare/workerd-linux-arm64": {
      "version": "1.20260217.0",
      "resolved": "https://registry.npmjs.org/@cloudflare/workerd-linux-arm64/-/workerd-linux-arm64-1.20260217.0.tgz",
      "integrity": "sha512-RGU1wq69ym4sFBVWhQeddZrRrG0hJM/SlZ5DwVDga/zBJ3WXxcDsFAgg1dToDfildTde5ySXN7jAasSmWko9rg==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=16"
      }
    },
    "node_modules/@cloudflare/workerd-windows-64": {
      "version": "1.20260217.0",
      "resolved": "https://registry.npmjs.org/@cloudflare/workerd-windows-64/-/workerd-windows-64-1.20260217.0.tgz",
      "integrity": "sha512-4T65u1321z1Zet9n7liQsSW7g3EXM5SWIT7kJ/uqkEtkPnIzZBIowMQgkvL5W9SpGZks9t3mTQj7hiUia8Gq9Q==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">=16"
      }
    },
    "node_modules/@cloudflare/workers-types": {
      "version": "4.20260218.0",
      "resolved": "https://registry.npmjs.org/@cloudflare/workers-types/-/workers-types-4.20260218.0.tgz",
      "integrity": "sha512-E28uJNJb9J9pca3RaxjXm1JxAjp8td9/cudkY+IT8rio71NlshN7NKMe2Cr/6GN+RufbSnp+N3ZKP74xgUaL0A==",
      "dev": true,
      "license": "MIT OR Apache-2.0",
      "peer": true
    },
    "node_modules/@cspotcode/source-map-support": {
      "version": "0.8.1",
      "resolved": "https://registry.npmjs.org/@cspotcode/source-map-support/-/source-map-support-0.8.1.tgz",
      "integrity": "sha512-IchNf6dN4tHoMFIn/7OE8LWZ19Y6q/67Bmf6vnGREv8RSbBVb9LPJxEcnwrcwX6ixSvaiGoomAUvu4YSxXrVgw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@jridgewell/trace-mapping": "0.3.9"
      },
      "engines": {
        "node": ">=12"
      }
    },
    "node_modules/@emnapi/runtime": {
      "version": "1.8.1",
      "resolved": "https://registry.npmjs.org/@emnapi/runtime/-/runtime-1.8.1.tgz",
      "integrity": "sha512-mehfKSMWjjNol8659Z8KxEMrdSJDDot5SXMq00dM8BN4o+CLNXQ0xH2V7EchNHV4RmbZLmmPdEaXZc5H2FXmDg==",
      "dev": true,
      "license": "MIT",
      "optional": true,
      "dependencies": {
        "tslib": "^2.4.0"
      }
    },
    "node_modules/@esbuild/aix-ppc64": {
      "version": "0.27.3",
      "resolved": "https://registry.npmjs.org/@esbuild/aix-ppc64/-/aix-ppc64-0.27.3.tgz",
      "integrity": "sha512-9fJMTNFTWZMh5qwrBItuziu834eOCUcEqymSH7pY+zoMVEZg3gcPuBNxH1EvfVYe9h0x/Ptw8KBzv7qxb7l8dg==",
      "cpu": [
        "ppc64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "aix"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/android-arm": {
      "version": "0.27.3",
      "resolved": "https://registry.npmjs.org/@esbuild/android-arm/-/android-arm-0.27.3.tgz",
      "integrity": "sha512-i5D1hPY7GIQmXlXhs2w8AWHhenb00+GxjxRncS2ZM7YNVGNfaMxgzSGuO8o8SJzRc/oZwU2bcScvVERk03QhzA==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/android-arm64": {
      "version": "0.27.3",
      "resolved": "https://registry.npmjs.org/@esbuild/android-arm64/-/android-arm64-0.27.3.tgz",
      "integrity": "sha512-YdghPYUmj/FX2SYKJ0OZxf+iaKgMsKHVPF1MAq/P8WirnSpCStzKJFjOjzsW0QQ7oIAiccHdcqjbHmJxRb/dmg==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/android-x64": {
      "version": "0.27.3",
      "resolved": "https://registry.npmjs.org/@esbuild/android-x64/-/android-x64-0.27.3.tgz",
      "integrity": "sha512-IN/0BNTkHtk8lkOM8JWAYFg4ORxBkZQf9zXiEOfERX/CzxW3Vg1ewAhU7QSWQpVIzTW+b8Xy+lGzdYXV6UZObQ==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "android"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/darwin-arm64": {
      "version": "0.27.3",
      "resolved": "https://registry.npmjs.org/@esbuild/darwin-arm64/-/darwin-arm64-0.27.3.tgz",
      "integrity": "sha512-Re491k7ByTVRy0t3EKWajdLIr0gz2kKKfzafkth4Q8A5n1xTHrkqZgLLjFEHVD+AXdUGgQMq+Godfq45mGpCKg==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/darwin-x64": {
      "version": "0.27.3",
      "resolved": "https://registry.npmjs.org/@esbuild/darwin-x64/-/darwin-x64-0.27.3.tgz",
      "integrity": "sha512-vHk/hA7/1AckjGzRqi6wbo+jaShzRowYip6rt6q7VYEDX4LEy1pZfDpdxCBnGtl+A5zq8iXDcyuxwtv3hNtHFg==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/freebsd-arm64": {
      "version": "0.27.3",
      "resolved": "https://registry.npmjs.org/@esbuild/freebsd-arm64/-/freebsd-arm64-0.27.3.tgz",
      "integrity": "sha512-ipTYM2fjt3kQAYOvo6vcxJx3nBYAzPjgTCk7QEgZG8AUO3ydUhvelmhrbOheMnGOlaSFUoHXB6un+A7q4ygY9w==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "freebsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/freebsd-x64": {
      "version": "0.27.3",
      "resolved": "https://registry.npmjs.org/@esbuild/freebsd-x64/-/freebsd-x64-0.27.3.tgz",
      "integrity": "sha512-dDk0X87T7mI6U3K9VjWtHOXqwAMJBNN2r7bejDsc+j03SEjtD9HrOl8gVFByeM0aJksoUuUVU9TBaZa2rgj0oA==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "freebsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-arm": {
      "version": "0.27.3",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-arm/-/linux-arm-0.27.3.tgz",
      "integrity": "sha512-s6nPv2QkSupJwLYyfS+gwdirm0ukyTFNl3KTgZEAiJDd+iHZcbTPPcWCcRYH+WlNbwChgH2QkE9NSlNrMT8Gfw==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-arm64": {
      "version": "0.27.3",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-arm64/-/linux-arm64-0.27.3.tgz",
      "integrity": "sha512-sZOuFz/xWnZ4KH3YfFrKCf1WyPZHakVzTiqji3WDc0BCl2kBwiJLCXpzLzUBLgmp4veFZdvN5ChW4Eq/8Fc2Fg==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-ia32": {
      "version": "0.27.3",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-ia32/-/linux-ia32-0.27.3.tgz",
      "integrity": "sha512-yGlQYjdxtLdh0a3jHjuwOrxQjOZYD/C9PfdbgJJF3TIZWnm/tMd/RcNiLngiu4iwcBAOezdnSLAwQDPqTmtTYg==",
      "cpu": [
        "ia32"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-loong64": {
      "version": "0.27.3",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-loong64/-/linux-loong64-0.27.3.tgz",
      "integrity": "sha512-WO60Sn8ly3gtzhyjATDgieJNet/KqsDlX5nRC5Y3oTFcS1l0KWba+SEa9Ja1GfDqSF1z6hif/SkpQJbL63cgOA==",
      "cpu": [
        "loong64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-mips64el": {
      "version": "0.27.3",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-mips64el/-/linux-mips64el-0.27.3.tgz",
      "integrity": "sha512-APsymYA6sGcZ4pD6k+UxbDjOFSvPWyZhjaiPyl/f79xKxwTnrn5QUnXR5prvetuaSMsb4jgeHewIDCIWljrSxw==",
      "cpu": [
        "mips64el"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-ppc64": {
      "version": "0.27.3",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-ppc64/-/linux-ppc64-0.27.3.tgz",
      "integrity": "sha512-eizBnTeBefojtDb9nSh4vvVQ3V9Qf9Df01PfawPcRzJH4gFSgrObw+LveUyDoKU3kxi5+9RJTCWlj4FjYXVPEA==",
      "cpu": [
        "ppc64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-riscv64": {
      "version": "0.27.3",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-riscv64/-/linux-riscv64-0.27.3.tgz",
      "integrity": "sha512-3Emwh0r5wmfm3ssTWRQSyVhbOHvqegUDRd0WhmXKX2mkHJe1SFCMJhagUleMq+Uci34wLSipf8Lagt4LlpRFWQ==",
      "cpu": [
        "riscv64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-s390x": {
      "version": "0.27.3",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-s390x/-/linux-s390x-0.27.3.tgz",
      "integrity": "sha512-pBHUx9LzXWBc7MFIEEL0yD/ZVtNgLytvx60gES28GcWMqil8ElCYR4kvbV2BDqsHOvVDRrOxGySBM9Fcv744hw==",
      "cpu": [
        "s390x"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/linux-x64": {
      "version": "0.27.3",
      "resolved": "https://registry.npmjs.org/@esbuild/linux-x64/-/linux-x64-0.27.3.tgz",
      "integrity": "sha512-Czi8yzXUWIQYAtL/2y6vogER8pvcsOsk5cpwL4Gk5nJqH5UZiVByIY8Eorm5R13gq+DQKYg0+JyQoytLQas4dA==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/netbsd-arm64": {
      "version": "0.27.3",
      "resolved": "https://registry.npmjs.org/@esbuild/netbsd-arm64/-/netbsd-arm64-0.27.3.tgz",
      "integrity": "sha512-sDpk0RgmTCR/5HguIZa9n9u+HVKf40fbEUt+iTzSnCaGvY9kFP0YKBWZtJaraonFnqef5SlJ8/TiPAxzyS+UoA==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "netbsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/netbsd-x64": {
      "version": "0.27.3",
      "resolved": "https://registry.npmjs.org/@esbuild/netbsd-x64/-/netbsd-x64-0.27.3.tgz",
      "integrity": "sha512-P14lFKJl/DdaE00LItAukUdZO5iqNH7+PjoBm+fLQjtxfcfFE20Xf5CrLsmZdq5LFFZzb5JMZ9grUwvtVYzjiA==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "netbsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/openbsd-arm64": {
      "version": "0.27.3",
      "resolved": "https://registry.npmjs.org/@esbuild/openbsd-arm64/-/openbsd-arm64-0.27.3.tgz",
      "integrity": "sha512-AIcMP77AvirGbRl/UZFTq5hjXK+2wC7qFRGoHSDrZ5v5b8DK/GYpXW3CPRL53NkvDqb9D+alBiC/dV0Fb7eJcw==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "openbsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/openbsd-x64": {
      "version": "0.27.3",
      "resolved": "https://registry.npmjs.org/@esbuild/openbsd-x64/-/openbsd-x64-0.27.3.tgz",
      "integrity": "sha512-DnW2sRrBzA+YnE70LKqnM3P+z8vehfJWHXECbwBmH/CU51z6FiqTQTHFenPlHmo3a8UgpLyH3PT+87OViOh1AQ==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "openbsd"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/openharmony-arm64": {
      "version": "0.27.3",
      "resolved": "https://registry.npmjs.org/@esbuild/openharmony-arm64/-/openharmony-arm64-0.27.3.tgz",
      "integrity": "sha512-NinAEgr/etERPTsZJ7aEZQvvg/A6IsZG/LgZy+81wON2huV7SrK3e63dU0XhyZP4RKGyTm7aOgmQk0bGp0fy2g==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "openharmony"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/sunos-x64": {
      "version": "0.27.3",
      "resolved": "https://registry.npmjs.org/@esbuild/sunos-x64/-/sunos-x64-0.27.3.tgz",
      "integrity": "sha512-PanZ+nEz+eWoBJ8/f8HKxTTD172SKwdXebZ0ndd953gt1HRBbhMsaNqjTyYLGLPdoWHy4zLU7bDVJztF5f3BHA==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "sunos"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/win32-arm64": {
      "version": "0.27.3",
      "resolved": "https://registry.npmjs.org/@esbuild/win32-arm64/-/win32-arm64-0.27.3.tgz",
      "integrity": "sha512-B2t59lWWYrbRDw/tjiWOuzSsFh1Y/E95ofKz7rIVYSQkUYBjfSgf6oeYPNWHToFRr2zx52JKApIcAS/D5TUBnA==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/win32-ia32": {
      "version": "0.27.3",
      "resolved": "https://registry.npmjs.org/@esbuild/win32-ia32/-/win32-ia32-0.27.3.tgz",
      "integrity": "sha512-QLKSFeXNS8+tHW7tZpMtjlNb7HKau0QDpwm49u0vUp9y1WOF+PEzkU84y9GqYaAVW8aH8f3GcBck26jh54cX4Q==",
      "cpu": [
        "ia32"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@esbuild/win32-x64": {
      "version": "0.27.3",
      "resolved": "https://registry.npmjs.org/@esbuild/win32-x64/-/win32-x64-0.27.3.tgz",
      "integrity": "sha512-4uJGhsxuptu3OcpVAzli+/gWusVGwZZHTlS63hh++ehExkVT8SgiEf7/uC/PclrPPkLhZqGgCTjd0VWLo6xMqA==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@img/colour": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/@img/colour/-/colour-1.0.0.tgz",
      "integrity": "sha512-A5P/LfWGFSl6nsckYtjw9da+19jB8hkJ6ACTGcDfEJ0aE+l2n2El7dsVM7UVHZQ9s2lmYMWlrS21YLy2IR1LUw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=18"
      }
    },
    "node_modules/@img/sharp-darwin-arm64": {
      "version": "0.34.5",
      "resolved": "https://registry.npmjs.org/@img/sharp-darwin-arm64/-/sharp-darwin-arm64-0.34.5.tgz",
      "integrity": "sha512-imtQ3WMJXbMY4fxb/Ndp6HBTNVtWCUI0WdobyheGf5+ad6xX8VIDO8u2xE4qc/fr08CKG/7dDseFtn6M6g/r3w==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      },
      "optionalDependencies": {
        "@img/sharp-libvips-darwin-arm64": "1.2.4"
      }
    },
    "node_modules/@img/sharp-darwin-x64": {
      "version": "0.34.5",
      "resolved": "https://registry.npmjs.org/@img/sharp-darwin-x64/-/sharp-darwin-x64-0.34.5.tgz",
      "integrity": "sha512-YNEFAF/4KQ/PeW0N+r+aVVsoIY0/qxxikF2SWdp+NRkmMB7y9LBZAVqQ4yhGCm/H3H270OSykqmQMKLBhBJDEw==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      },
      "optionalDependencies": {
        "@img/sharp-libvips-darwin-x64": "1.2.4"
      }
    },
    "node_modules/@img/sharp-libvips-darwin-arm64": {
      "version": "1.2.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-darwin-arm64/-/sharp-libvips-darwin-arm64-1.2.4.tgz",
      "integrity": "sha512-zqjjo7RatFfFoP0MkQ51jfuFZBnVE2pRiaydKJ1G/rHZvnsrHAOcQALIi9sA5co5xenQdTugCvtb1cuf78Vf4g==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "darwin"
      ],
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-libvips-darwin-x64": {
      "version": "1.2.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-darwin-x64/-/sharp-libvips-darwin-x64-1.2.4.tgz",
      "integrity": "sha512-1IOd5xfVhlGwX+zXv2N93k0yMONvUlANylbJw1eTah8K/Jtpi15KC+WSiaX/nBmbm2HxRM1gZ0nSdjSsrZbGKg==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "darwin"
      ],
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-libvips-linux-arm": {
      "version": "1.2.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-linux-arm/-/sharp-libvips-linux-arm-1.2.4.tgz",
      "integrity": "sha512-bFI7xcKFELdiNCVov8e44Ia4u2byA+l3XtsAj+Q8tfCwO6BQ8iDojYdvoPMqsKDkuoOo+X6HZA0s0q11ANMQ8A==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "linux"
      ],
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-libvips-linux-arm64": {
      "version": "1.2.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-linux-arm64/-/sharp-libvips-linux-arm64-1.2.4.tgz",
      "integrity": "sha512-excjX8DfsIcJ10x1Kzr4RcWe1edC9PquDRRPx3YVCvQv+U5p7Yin2s32ftzikXojb1PIFc/9Mt28/y+iRklkrw==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "linux"
      ],
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-libvips-linux-ppc64": {
      "version": "1.2.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-linux-ppc64/-/sharp-libvips-linux-ppc64-1.2.4.tgz",
      "integrity": "sha512-FMuvGijLDYG6lW+b/UvyilUWu5Ayu+3r2d1S8notiGCIyYU/76eig1UfMmkZ7vwgOrzKzlQbFSuQfgm7GYUPpA==",
      "cpu": [
        "ppc64"
      ],
      "dev": true,
      "license": "LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "linux"
      ],
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-libvips-linux-riscv64": {
      "version": "1.2.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-linux-riscv64/-/sharp-libvips-linux-riscv64-1.2.4.tgz",
      "integrity": "sha512-oVDbcR4zUC0ce82teubSm+x6ETixtKZBh/qbREIOcI3cULzDyb18Sr/Wcyx7NRQeQzOiHTNbZFF1UwPS2scyGA==",
      "cpu": [
        "riscv64"
      ],
      "dev": true,
      "license": "LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "linux"
      ],
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-libvips-linux-s390x": {
      "version": "1.2.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-linux-s390x/-/sharp-libvips-linux-s390x-1.2.4.tgz",
      "integrity": "sha512-qmp9VrzgPgMoGZyPvrQHqk02uyjA0/QrTO26Tqk6l4ZV0MPWIW6LTkqOIov+J1yEu7MbFQaDpwdwJKhbJvuRxQ==",
      "cpu": [
        "s390x"
      ],
      "dev": true,
      "license": "LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "linux"
      ],
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-libvips-linux-x64": {
      "version": "1.2.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-linux-x64/-/sharp-libvips-linux-x64-1.2.4.tgz",
      "integrity": "sha512-tJxiiLsmHc9Ax1bz3oaOYBURTXGIRDODBqhveVHonrHJ9/+k89qbLl0bcJns+e4t4rvaNBxaEZsFtSfAdquPrw==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "linux"
      ],
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-libvips-linuxmusl-arm64": {
      "version": "1.2.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-linuxmusl-arm64/-/sharp-libvips-linuxmusl-arm64-1.2.4.tgz",
      "integrity": "sha512-FVQHuwx1IIuNow9QAbYUzJ+En8KcVm9Lk5+uGUQJHaZmMECZmOlix9HnH7n1TRkXMS0pGxIJokIVB9SuqZGGXw==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "linux"
      ],
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-libvips-linuxmusl-x64": {
      "version": "1.2.4",
      "resolved": "https://registry.npmjs.org/@img/sharp-libvips-linuxmusl-x64/-/sharp-libvips-linuxmusl-x64-1.2.4.tgz",
      "integrity": "sha512-+LpyBk7L44ZIXwz/VYfglaX/okxezESc6UxDSoyo2Ks6Jxc4Y7sGjpgU9s4PMgqgjj1gZCylTieNamqA1MF7Dg==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "linux"
      ],
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-linux-arm": {
      "version": "0.34.5",
      "resolved": "https://registry.npmjs.org/@img/sharp-linux-arm/-/sharp-linux-arm-0.34.5.tgz",
      "integrity": "sha512-9dLqsvwtg1uuXBGZKsxem9595+ujv0sJ6Vi8wcTANSFpwV/GONat5eCkzQo/1O6zRIkh0m/8+5BjrRr7jDUSZw==",
      "cpu": [
        "arm"
      ],
      "dev": true,
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      },
      "optionalDependencies": {
        "@img/sharp-libvips-linux-arm": "1.2.4"
      }
    },
    "node_modules/@img/sharp-linux-arm64": {
      "version": "0.34.5",
      "resolved": "https://registry.npmjs.org/@img/sharp-linux-arm64/-/sharp-linux-arm64-0.34.5.tgz",
      "integrity": "sha512-bKQzaJRY/bkPOXyKx5EVup7qkaojECG6NLYswgktOZjaXecSAeCWiZwwiFf3/Y+O1HrauiE3FVsGxFg8c24rZg==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      },
      "optionalDependencies": {
        "@img/sharp-libvips-linux-arm64": "1.2.4"
      }
    },
    "node_modules/@img/sharp-linux-ppc64": {
      "version": "0.34.5",
      "resolved": "https://registry.npmjs.org/@img/sharp-linux-ppc64/-/sharp-linux-ppc64-0.34.5.tgz",
      "integrity": "sha512-7zznwNaqW6YtsfrGGDA6BRkISKAAE1Jo0QdpNYXNMHu2+0dTrPflTLNkpc8l7MUP5M16ZJcUvysVWWrMefZquA==",
      "cpu": [
        "ppc64"
      ],
      "dev": true,
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      },
      "optionalDependencies": {
        "@img/sharp-libvips-linux-ppc64": "1.2.4"
      }
    },
    "node_modules/@img/sharp-linux-riscv64": {
      "version": "0.34.5",
      "resolved": "https://registry.npmjs.org/@img/sharp-linux-riscv64/-/sharp-linux-riscv64-0.34.5.tgz",
      "integrity": "sha512-51gJuLPTKa7piYPaVs8GmByo7/U7/7TZOq+cnXJIHZKavIRHAP77e3N2HEl3dgiqdD/w0yUfiJnII77PuDDFdw==",
      "cpu": [
        "riscv64"
      ],
      "dev": true,
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      },
      "optionalDependencies": {
        "@img/sharp-libvips-linux-riscv64": "1.2.4"
      }
    },
    "node_modules/@img/sharp-linux-s390x": {
      "version": "0.34.5",
      "resolved": "https://registry.npmjs.org/@img/sharp-linux-s390x/-/sharp-linux-s390x-0.34.5.tgz",
      "integrity": "sha512-nQtCk0PdKfho3eC5MrbQoigJ2gd1CgddUMkabUj+rBevs8tZ2cULOx46E7oyX+04WGfABgIwmMC0VqieTiR4jg==",
      "cpu": [
        "s390x"
      ],
      "dev": true,
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      },
      "optionalDependencies": {
        "@img/sharp-libvips-linux-s390x": "1.2.4"
      }
    },
    "node_modules/@img/sharp-linux-x64": {
      "version": "0.34.5",
      "resolved": "https://registry.npmjs.org/@img/sharp-linux-x64/-/sharp-linux-x64-0.34.5.tgz",
      "integrity": "sha512-MEzd8HPKxVxVenwAa+JRPwEC7QFjoPWuS5NZnBt6B3pu7EG2Ge0id1oLHZpPJdn3OQK+BQDiw9zStiHBTJQQQQ==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      },
      "optionalDependencies": {
        "@img/sharp-libvips-linux-x64": "1.2.4"
      }
    },
    "node_modules/@img/sharp-linuxmusl-arm64": {
      "version": "0.34.5",
      "resolved": "https://registry.npmjs.org/@img/sharp-linuxmusl-arm64/-/sharp-linuxmusl-arm64-0.34.5.tgz",
      "integrity": "sha512-fprJR6GtRsMt6Kyfq44IsChVZeGN97gTD331weR1ex1c1rypDEABN6Tm2xa1wE6lYb5DdEnk03NZPqA7Id21yg==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      },
      "optionalDependencies": {
        "@img/sharp-libvips-linuxmusl-arm64": "1.2.4"
      }
    },
    "node_modules/@img/sharp-linuxmusl-x64": {
      "version": "0.34.5",
      "resolved": "https://registry.npmjs.org/@img/sharp-linuxmusl-x64/-/sharp-linuxmusl-x64-0.34.5.tgz",
      "integrity": "sha512-Jg8wNT1MUzIvhBFxViqrEhWDGzqymo3sV7z7ZsaWbZNDLXRJZoRGrjulp60YYtV4wfY8VIKcWidjojlLcWrd8Q==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "Apache-2.0",
      "optional": true,
      "os": [
        "linux"
      ],
      "engines": {
        "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      },
      "optionalDependencies": {
        "@img/sharp-libvips-linuxmusl-x64": "1.2.4"
      }
    },
    "node_modules/@img/sharp-wasm32": {
      "version": "0.34.5",
      "resolved": "https://registry.npmjs.org/@img/sharp-wasm32/-/sharp-wasm32-0.34.5.tgz",
      "integrity": "sha512-OdWTEiVkY2PHwqkbBI8frFxQQFekHaSSkUIJkwzclWZe64O1X4UlUjqqqLaPbUpMOQk6FBu/HtlGXNblIs0huw==",
      "cpu": [
        "wasm32"
      ],
      "dev": true,
      "license": "Apache-2.0 AND LGPL-3.0-or-later AND MIT",
      "optional": true,
      "dependencies": {
        "@emnapi/runtime": "^1.7.0"
      },
      "engines": {
        "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-win32-arm64": {
      "version": "0.34.5",
      "resolved": "https://registry.npmjs.org/@img/sharp-win32-arm64/-/sharp-win32-arm64-0.34.5.tgz",
      "integrity": "sha512-WQ3AgWCWYSb2yt+IG8mnC6Jdk9Whs7O0gxphblsLvdhSpSTtmu69ZG1Gkb6NuvxsNACwiPV6cNSZNzt0KPsw7g==",
      "cpu": [
        "arm64"
      ],
      "dev": true,
      "license": "Apache-2.0 AND LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-win32-ia32": {
      "version": "0.34.5",
      "resolved": "https://registry.npmjs.org/@img/sharp-win32-ia32/-/sharp-win32-ia32-0.34.5.tgz",
      "integrity": "sha512-FV9m/7NmeCmSHDD5j4+4pNI8Cp3aW+JvLoXcTUo0IqyjSfAZJ8dIUmijx1qaJsIiU+Hosw6xM5KijAWRJCSgNg==",
      "cpu": [
        "ia32"
      ],
      "dev": true,
      "license": "Apache-2.0 AND LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@img/sharp-win32-x64": {
      "version": "0.34.5",
      "resolved": "https://registry.npmjs.org/@img/sharp-win32-x64/-/sharp-win32-x64-0.34.5.tgz",
      "integrity": "sha512-+29YMsqY2/9eFEiW93eqWnuLcWcufowXewwSNIT6UwZdUUCrM3oFjMWH/Z6/TMmb4hlFenmfAVbpWeup2jryCw==",
      "cpu": [
        "x64"
      ],
      "dev": true,
      "license": "Apache-2.0 AND LGPL-3.0-or-later",
      "optional": true,
      "os": [
        "win32"
      ],
      "engines": {
        "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      }
    },
    "node_modules/@jridgewell/resolve-uri": {
      "version": "3.1.2",
      "resolved": "https://registry.npmjs.org/@jridgewell/resolve-uri/-/resolve-uri-3.1.2.tgz",
      "integrity": "sha512-bRISgCIjP20/tbWSPWMEi54QVPRZExkuD9lJL+UIxUKtwVJA8wW1Trb1jMs1RFXo1CBTNZ/5hpC9QvmKWdopKw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=6.0.0"
      }
    },
    "node_modules/@jridgewell/sourcemap-codec": {
      "version": "1.5.5",
      "resolved": "https://registry.npmjs.org/@jridgewell/sourcemap-codec/-/sourcemap-codec-1.5.5.tgz",
      "integrity": "sha512-cYQ9310grqxueWbl+WuIUIaiUaDcj7WOq5fVhEljNVgRfOUhY9fy2zTvfoqWsnebh8Sl70VScFbICvJnLKB0Og==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/@jridgewell/trace-mapping": {
      "version": "0.3.9",
      "resolved": "https://registry.npmjs.org/@jridgewell/trace-mapping/-/trace-mapping-0.3.9.tgz",
      "integrity": "sha512-3Belt6tdc8bPgAtbcmdtNJlirVoTmEb5e2gC94PnkwEW9jI6CAHUeoG85tjWP5WquqfavoMtMwiG4P926ZKKuQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@jridgewell/resolve-uri": "^3.0.3",
        "@jridgewell/sourcemap-codec": "^1.4.10"
      }
    },
    "node_modules/@poppinss/colors": {
      "version": "4.1.6",
      "resolved": "https://registry.npmjs.org/@poppinss/colors/-/colors-4.1.6.tgz",
      "integrity": "sha512-H9xkIdFswbS8n1d6vmRd8+c10t2Qe+rZITbbDHHkQixH5+2x1FDGmi/0K+WgWiqQFKPSlIYB7jlH6Kpfn6Fleg==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "kleur": "^4.1.5"
      }
    },
    "node_modules/@poppinss/dumper": {
      "version": "0.6.5",
      "resolved": "https://registry.npmjs.org/@poppinss/dumper/-/dumper-0.6.5.tgz",
      "integrity": "sha512-NBdYIb90J7LfOI32dOewKI1r7wnkiH6m920puQ3qHUeZkxNkQiFnXVWoE6YtFSv6QOiPPf7ys6i+HWWecDz7sw==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@poppinss/colors": "^4.1.5",
        "@sindresorhus/is": "^7.0.2",
        "supports-color": "^10.0.0"
      }
    },
    "node_modules/@poppinss/exception": {
      "version": "1.2.3",
      "resolved": "https://registry.npmjs.org/@poppinss/exception/-/exception-1.2.3.tgz",
      "integrity": "sha512-dCED+QRChTVatE9ibtoaxc+WkdzOSjYTKi/+uacHWIsfodVfpsueo3+DKpgU5Px8qXjgmXkSvhXvSCz3fnP9lw==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/@sindresorhus/is": {
      "version": "7.2.0",
      "resolved": "https://registry.npmjs.org/@sindresorhus/is/-/is-7.2.0.tgz",
      "integrity": "sha512-P1Cz1dWaFfR4IR+U13mqqiGsLFf1KbayybWwdd2vfctdV6hDpUkgCY0nKOLLTMSoRd/jJNjtbqzf13K8DCCXQw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/sindresorhus/is?sponsor=1"
      }
    },
    "node_modules/@speed-highlight/core": {
      "version": "1.2.14",
      "resolved": "https://registry.npmjs.org/@speed-highlight/core/-/core-1.2.14.tgz",
      "integrity": "sha512-G4ewlBNhUtlLvrJTb88d2mdy2KRijzs4UhnlrOSRT4bmjh/IqNElZa3zkrZ+TC47TwtlDWzVLFADljF1Ijp5hA==",
      "dev": true,
      "license": "CC0-1.0"
    },
    "node_modules/blake3-wasm": {
      "version": "2.1.5",
      "resolved": "https://registry.npmjs.org/blake3-wasm/-/blake3-wasm-2.1.5.tgz",
      "integrity": "sha512-F1+K8EbfOZE49dtoPtmxUQrpXaBIl3ICvasLh+nJta0xkz+9kF/7uet9fLnwKqhDrmj6g+6K3Tw9yQPUg2ka5g==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/cookie": {
      "version": "1.1.1",
      "resolved": "https://registry.npmjs.org/cookie/-/cookie-1.1.1.tgz",
      "integrity": "sha512-ei8Aos7ja0weRpFzJnEA9UHJ/7XQmqglbRwnf2ATjcB9Wq874VKH9kfjjirM6UhU2/E5fFYadylyhFldcqSidQ==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "type": "opencollective",
        "url": "https://opencollective.com/express"
      }
    },
    "node_modules/detect-libc": {
      "version": "2.1.2",
      "resolved": "https://registry.npmjs.org/detect-libc/-/detect-libc-2.1.2.tgz",
      "integrity": "sha512-Btj2BOOO83o3WyH59e8MgXsxEQVcarkUOpEYrubB0urwnN10yQ364rsiByU11nZlqWYZm05i/of7io4mzihBtQ==",
      "dev": true,
      "license": "Apache-2.0",
      "engines": {
        "node": ">=8"
      }
    },
    "node_modules/error-stack-parser-es": {
      "version": "1.0.5",
      "resolved": "https://registry.npmjs.org/error-stack-parser-es/-/error-stack-parser-es-1.0.5.tgz",
      "integrity": "sha512-5qucVt2XcuGMcEGgWI7i+yZpmpByQ8J1lHhcL7PwqCwu9FPP3VUXzT4ltHe5i2z9dePwEHcDVOAfSnHsOlCXRA==",
      "dev": true,
      "license": "MIT",
      "funding": {
        "url": "https://github.com/sponsors/antfu"
      }
    },
    "node_modules/esbuild": {
      "version": "0.27.3",
      "resolved": "https://registry.npmjs.org/esbuild/-/esbuild-0.27.3.tgz",
      "integrity": "sha512-8VwMnyGCONIs6cWue2IdpHxHnAjzxnw2Zr7MkVxB2vjmQ2ivqGFb4LEG3SMnv0Gb2F/G/2yA8zUaiL1gywDCCg==",
      "dev": true,
      "hasInstallScript": true,
      "license": "MIT",
      "bin": {
        "esbuild": "bin/esbuild"
      },
      "engines": {
        "node": ">=18"
      },
      "optionalDependencies": {
        "@esbuild/aix-ppc64": "0.27.3",
        "@esbuild/android-arm": "0.27.3",
        "@esbuild/android-arm64": "0.27.3",
        "@esbuild/android-x64": "0.27.3",
        "@esbuild/darwin-arm64": "0.27.3",
        "@esbuild/darwin-x64": "0.27.3",
        "@esbuild/freebsd-arm64": "0.27.3",
        "@esbuild/freebsd-x64": "0.27.3",
        "@esbuild/linux-arm": "0.27.3",
        "@esbuild/linux-arm64": "0.27.3",
        "@esbuild/linux-ia32": "0.27.3",
        "@esbuild/linux-loong64": "0.27.3",
        "@esbuild/linux-mips64el": "0.27.3",
        "@esbuild/linux-ppc64": "0.27.3",
        "@esbuild/linux-riscv64": "0.27.3",
        "@esbuild/linux-s390x": "0.27.3",
        "@esbuild/linux-x64": "0.27.3",
        "@esbuild/netbsd-arm64": "0.27.3",
        "@esbuild/netbsd-x64": "0.27.3",
        "@esbuild/openbsd-arm64": "0.27.3",
        "@esbuild/openbsd-x64": "0.27.3",
        "@esbuild/openharmony-arm64": "0.27.3",
        "@esbuild/sunos-x64": "0.27.3",
        "@esbuild/win32-arm64": "0.27.3",
        "@esbuild/win32-ia32": "0.27.3",
        "@esbuild/win32-x64": "0.27.3"
      }
    },
    "node_modules/fsevents": {
      "version": "2.3.3",
      "resolved": "https://registry.npmjs.org/fsevents/-/fsevents-2.3.3.tgz",
      "integrity": "sha512-5xoDfX+fL7faATnagmWPpbFtwh/R77WmMMqqHGS65C3vvB0YHrgF+B1YmZ3441tMj5n63k0212XNoJwzlhffQw==",
      "dev": true,
      "hasInstallScript": true,
      "license": "MIT",
      "optional": true,
      "os": [
        "darwin"
      ],
      "engines": {
        "node": "^8.16.0 || ^10.6.0 || >=11.0.0"
      }
    },
    "node_modules/kleur": {
      "version": "4.1.5",
      "resolved": "https://registry.npmjs.org/kleur/-/kleur-4.1.5.tgz",
      "integrity": "sha512-o+NO+8WrRiQEE4/7nwRJhN1HWpVmJm511pBHUxPLtp0BUISzlBplORYSmTclCnJvQq2tKu/sgl3xVpkc7ZWuQQ==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=6"
      }
    },
    "node_modules/miniflare": {
      "version": "4.20260217.0",
      "resolved": "https://registry.npmjs.org/miniflare/-/miniflare-4.20260217.0.tgz",
      "integrity": "sha512-t2v02Vi9SUiiXoHoxLvsntli7N35e/35PuRAYEqHWtHOdDX3bqQ73dBQ0tI12/8ThCb2by2tVs7qOvgwn6xSBQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@cspotcode/source-map-support": "0.8.1",
        "sharp": "^0.34.5",
        "undici": "7.18.2",
        "workerd": "1.20260217.0",
        "ws": "8.18.0",
        "youch": "4.1.0-beta.10"
      },
      "bin": {
        "miniflare": "bootstrap.js"
      },
      "engines": {
        "node": ">=18.0.0"
      }
    },
    "node_modules/openai": {
      "version": "6.22.0",
      "resolved": "https://registry.npmjs.org/openai/-/openai-6.22.0.tgz",
      "integrity": "sha512-7Yvy17F33Bi9RutWbsaYt5hJEEJ/krRPOrwan+f9aCPuMat1WVsb2VNSII5W1EksKT6fF69TG/xj4XzodK3JZw==",
      "license": "Apache-2.0",
      "bin": {
        "openai": "bin/cli"
      },
      "peerDependencies": {
        "ws": "^8.18.0",
        "zod": "^3.25 || ^4.0"
      },
      "peerDependenciesMeta": {
        "ws": {
          "optional": true
        },
        "zod": {
          "optional": true
        }
      }
    },
    "node_modules/path-to-regexp": {
      "version": "6.3.0",
      "resolved": "https://registry.npmjs.org/path-to-regexp/-/path-to-regexp-6.3.0.tgz",
      "integrity": "sha512-Yhpw4T9C6hPpgPeA28us07OJeqZ5EzQTkbfwuhsUg0c237RomFoETJgmp2sa3F/41gfLE6G5cqcYwznmeEeOlQ==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/pathe": {
      "version": "2.0.3",
      "resolved": "https://registry.npmjs.org/pathe/-/pathe-2.0.3.tgz",
      "integrity": "sha512-WUjGcAqP1gQacoQe+OBJsFA7Ld4DyXuUIjZ5cc75cLHvJ7dtNsTugphxIADwspS+AraAUePCKrSVtPLFj/F88w==",
      "dev": true,
      "license": "MIT"
    },
    "node_modules/semver": {
      "version": "7.7.4",
      "resolved": "https://registry.npmjs.org/semver/-/semver-7.7.4.tgz",
      "integrity": "sha512-vFKC2IEtQnVhpT78h1Yp8wzwrf8CM+MzKMHGJZfBtzhZNycRFnXsHk6E5TxIkkMsgNS7mdX3AGB7x2QM2di4lA==",
      "dev": true,
      "license": "ISC",
      "bin": {
        "semver": "bin/semver.js"
      },
      "engines": {
        "node": ">=10"
      }
    },
    "node_modules/sharp": {
      "version": "0.34.5",
      "resolved": "https://registry.npmjs.org/sharp/-/sharp-0.34.5.tgz",
      "integrity": "sha512-Ou9I5Ft9WNcCbXrU9cMgPBcCK8LiwLqcbywW3t4oDV37n1pzpuNLsYiAV8eODnjbtQlSDwZ2cUEeQz4E54Hltg==",
      "dev": true,
      "hasInstallScript": true,
      "license": "Apache-2.0",
      "dependencies": {
        "@img/colour": "^1.0.0",
        "detect-libc": "^2.1.2",
        "semver": "^7.7.3"
      },
      "engines": {
        "node": "^18.17.0 || ^20.3.0 || >=21.0.0"
      },
      "funding": {
        "url": "https://opencollective.com/libvips"
      },
      "optionalDependencies": {
        "@img/sharp-darwin-arm64": "0.34.5",
        "@img/sharp-darwin-x64": "0.34.5",
        "@img/sharp-libvips-darwin-arm64": "1.2.4",
        "@img/sharp-libvips-darwin-x64": "1.2.4",
        "@img/sharp-libvips-linux-arm": "1.2.4",
        "@img/sharp-libvips-linux-arm64": "1.2.4",
        "@img/sharp-libvips-linux-ppc64": "1.2.4",
        "@img/sharp-libvips-linux-riscv64": "1.2.4",
        "@img/sharp-libvips-linux-s390x": "1.2.4",
        "@img/sharp-libvips-linux-x64": "1.2.4",
        "@img/sharp-libvips-linuxmusl-arm64": "1.2.4",
        "@img/sharp-libvips-linuxmusl-x64": "1.2.4",
        "@img/sharp-linux-arm": "0.34.5",
        "@img/sharp-linux-arm64": "0.34.5",
        "@img/sharp-linux-ppc64": "0.34.5",
        "@img/sharp-linux-riscv64": "0.34.5",
        "@img/sharp-linux-s390x": "0.34.5",
        "@img/sharp-linux-x64": "0.34.5",
        "@img/sharp-linuxmusl-arm64": "0.34.5",
        "@img/sharp-linuxmusl-x64": "0.34.5",
        "@img/sharp-wasm32": "0.34.5",
        "@img/sharp-win32-arm64": "0.34.5",
        "@img/sharp-win32-ia32": "0.34.5",
        "@img/sharp-win32-x64": "0.34.5"
      }
    },
    "node_modules/supports-color": {
      "version": "10.2.2",
      "resolved": "https://registry.npmjs.org/supports-color/-/supports-color-10.2.2.tgz",
      "integrity": "sha512-SS+jx45GF1QjgEXQx4NJZV9ImqmO2NPz5FNsIHrsDjh2YsHnawpan7SNQ1o8NuhrbHZy9AZhIoCUiCeaW/C80g==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=18"
      },
      "funding": {
        "url": "https://github.com/chalk/supports-color?sponsor=1"
      }
    },
    "node_modules/tslib": {
      "version": "2.8.1",
      "resolved": "https://registry.npmjs.org/tslib/-/tslib-2.8.1.tgz",
      "integrity": "sha512-oJFu94HQb+KVduSUQL7wnpmqnfmLsOA/nAh6b6EH0wCEoK0/mPeXU6c3wKDV83MkOuHPRHtSXKKU99IBazS/2w==",
      "dev": true,
      "license": "0BSD",
      "optional": true
    },
    "node_modules/typescript": {
      "version": "5.9.3",
      "resolved": "https://registry.npmjs.org/typescript/-/typescript-5.9.3.tgz",
      "integrity": "sha512-jl1vZzPDinLr9eUt3J/t7V6FgNEw9QjvBPdysz9KfQDD41fQrC2Y4vKQdiaUpFT4bXlb1RHhLpp8wtm6M5TgSw==",
      "dev": true,
      "license": "Apache-2.0",
      "bin": {
        "tsc": "bin/tsc",
        "tsserver": "bin/tsserver"
      },
      "engines": {
        "node": ">=14.17"
      }
    },
    "node_modules/undici": {
      "version": "7.18.2",
      "resolved": "https://registry.npmjs.org/undici/-/undici-7.18.2.tgz",
      "integrity": "sha512-y+8YjDFzWdQlSE9N5nzKMT3g4a5UBX1HKowfdXh0uvAnTaqqwqB92Jt4UXBAeKekDs5IaDKyJFR4X1gYVCgXcw==",
      "dev": true,
      "license": "MIT",
      "engines": {
        "node": ">=20.18.1"
      }
    },
    "node_modules/unenv": {
      "version": "2.0.0-rc.24",
      "resolved": "https://registry.npmjs.org/unenv/-/unenv-2.0.0-rc.24.tgz",
      "integrity": "sha512-i7qRCmY42zmCwnYlh9H2SvLEypEFGye5iRmEMKjcGi7zk9UquigRjFtTLz0TYqr0ZGLZhaMHl/foy1bZR+Cwlw==",
      "dev": true,
      "license": "MIT",
      "peer": true,
      "dependencies": {
        "pathe": "^2.0.3"
      }
    },
    "node_modules/workerd": {
      "version": "1.20260217.0",
      "resolved": "https://registry.npmjs.org/workerd/-/workerd-1.20260217.0.tgz",
      "integrity": "sha512-6jVisS6wB6KbF+F9DVoDUy9p7MON8qZCFSaL8OcDUioMwknsUPFojUISu3/c30ZOZ24D4h7oqaahFc5C6huilw==",
      "dev": true,
      "hasInstallScript": true,
      "license": "Apache-2.0",
      "peer": true,
      "bin": {
        "workerd": "bin/workerd"
      },
      "engines": {
        "node": ">=16"
      },
      "optionalDependencies": {
        "@cloudflare/workerd-darwin-64": "1.20260217.0",
        "@cloudflare/workerd-darwin-arm64": "1.20260217.0",
        "@cloudflare/workerd-linux-64": "1.20260217.0",
        "@cloudflare/workerd-linux-arm64": "1.20260217.0",
        "@cloudflare/workerd-windows-64": "1.20260217.0"
      }
    },
    "node_modules/wrangler": {
      "version": "4.66.0",
      "resolved": "https://registry.npmjs.org/wrangler/-/wrangler-4.66.0.tgz",
      "integrity": "sha512-b9RVIdKai0BXDuYg0iN0zwVnVbULkvdKGP7Bf1uFY2GhJ/nzDGqgwQbCwgDIOhmaBC8ynhk/p22M2jc8tJy+dQ==",
      "dev": true,
      "license": "MIT OR Apache-2.0",
      "dependencies": {
        "@cloudflare/kv-asset-handler": "0.4.2",
        "@cloudflare/unenv-preset": "2.13.0",
        "blake3-wasm": "2.1.5",
        "esbuild": "0.27.3",
        "miniflare": "4.20260217.0",
        "path-to-regexp": "6.3.0",
        "unenv": "2.0.0-rc.24",
        "workerd": "1.20260217.0"
      },
      "bin": {
        "wrangler": "bin/wrangler.js",
        "wrangler2": "bin/wrangler.js"
      },
      "engines": {
        "node": ">=20.0.0"
      },
      "optionalDependencies": {
        "fsevents": "~2.3.2"
      },
      "peerDependencies": {
        "@cloudflare/workers-types": "^4.20260217.0"
      },
      "peerDependenciesMeta": {
        "@cloudflare/workers-types": {
          "optional": true
        }
      }
    },
    "node_modules/ws": {
      "version": "8.18.0",
      "resolved": "https://registry.npmjs.org/ws/-/ws-8.18.0.tgz",
      "integrity": "sha512-8VbfWfHLbbwu3+N6OKsOMpBdT4kXPDDB9cJk2bJ6mh9ucxdlnNvH1e+roYkKmN9Nxw2yjz7VzeO9oOz2zJ04Pw==",
      "devOptional": true,
      "license": "MIT",
      "peer": true,
      "engines": {
        "node": ">=10.0.0"
      },
      "peerDependencies": {
        "bufferutil": "^4.0.1",
        "utf-8-validate": ">=5.0.2"
      },
      "peerDependenciesMeta": {
        "bufferutil": {
          "optional": true
        },
        "utf-8-validate": {
          "optional": true
        }
      }
    },
    "node_modules/youch": {
      "version": "4.1.0-beta.10",
      "resolved": "https://registry.npmjs.org/youch/-/youch-4.1.0-beta.10.tgz",
      "integrity": "sha512-rLfVLB4FgQneDr0dv1oddCVZmKjcJ6yX6mS4pU82Mq/Dt9a3cLZQ62pDBL4AUO+uVrCvtWz3ZFUL2HFAFJ/BXQ==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@poppinss/colors": "^4.1.5",
        "@poppinss/dumper": "^0.6.4",
        "@speed-highlight/core": "^1.2.7",
        "cookie": "^1.0.2",
        "youch-core": "^0.3.3"
      }
    },
    "node_modules/youch-core": {
      "version": "0.3.3",
      "resolved": "https://registry.npmjs.org/youch-core/-/youch-core-0.3.3.tgz",
      "integrity": "sha512-ho7XuGjLaJ2hWHoK8yFnsUGy2Y5uDpqSTq1FkHLK4/oqKtyUU1AFbOOxY4IpC9f0fTLjwYbslUz0Po5BpD1wrA==",
      "dev": true,
      "license": "MIT",
      "dependencies": {
        "@poppinss/exception": "^1.2.2",
        "error-stack-parser-es": "^1.0.5"
      }
    }
  }
}
```

## `package.json`
```json
{
  "name": "werewolf-worker",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "wrangler dev",
    "deploy": "wrangler deploy",
    "check": "tsc --noEmit"
  },
  "dependencies": {
    "openai": "^6.4.0"
  },
  "devDependencies": {
    "@cloudflare/workers-types": "^4.20260218.0",
    "typescript": "^5.9.2",
    "wrangler": "^4.43.0"
  }
}
```

## `public/app.js`
```javascript
let currentState = null;
let busy = false;

const ui = {
  newBtn: document.getElementById("new-game-btn"),
  stepBtn: document.getElementById("step-btn"),
  runBtn: document.getElementById("run-btn"),
  exportLogBtn: document.getElementById("export-log-btn"),
  maxStepsInput: document.getElementById("max-steps-input"),
  statusList: document.getElementById("status-list"),
  aliveList: document.getElementById("alive-list"),
  rolesList: document.getElementById("roles-list"),
  timeline: document.getElementById("timeline"),
  eventsBody: document.getElementById("events-body"),
};

function updateExportLogButtonState() {
  const hasTimeline = Boolean(currentState?.timeline?.length);
  ui.exportLogBtn.disabled = busy || !hasTimeline;
}

function setBusy(nextBusy) {
  busy = nextBusy;
  [ui.newBtn, ui.stepBtn, ui.runBtn].forEach((btn) => {
    btn.disabled = busy;
  });
  updateExportLogButtonState();
}

async function requestJson(path, payload) {
  const response = await fetch(path, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload ?? {}),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || `请求失败: ${response.status}`);
  }
  return data;
}

function renderStatus() {
  const statusRows = [
    ["Game ID", currentState?.id ?? "-"],
    ["Day", currentState ? String(currentState.currentDay) : "-"],
    ["Next Phase", currentState?.nextPhase ?? "-"],
    ["Alive", currentState ? String(currentState.alivePlayers.length) : "-"],
    ["Winner", currentState?.winner ?? "-"],
    ["Finished", currentState ? String(Boolean(currentState.finished)) : "-"],
    ["Updated", currentState?.lastUpdatedAt ?? "-"],
  ];

  ui.statusList.innerHTML = statusRows
    .map(([key, value]) => `<div><dt>${key}</dt><dd>${value}</dd></div>`)
    .join("");
}

function renderChips() {
  ui.aliveList.innerHTML = "";
  if (!currentState?.alivePlayers?.length) {
    ui.aliveList.innerHTML = `<span class="chip">-</span>`;
  } else {
    currentState.alivePlayers.forEach((seat) => {
      const chip = document.createElement("span");
      chip.className = "chip";
      chip.textContent = seat;
      ui.aliveList.appendChild(chip);
    });
  }

  ui.rolesList.innerHTML = "";
  if (!currentState?.roles) {
    ui.rolesList.innerHTML = `<span class="chip">-</span>`;
    return;
  }
  Object.entries(currentState.roles)
    .sort((a, b) => Number(a[0].replace("Seat", "")) - Number(b[0].replace("Seat", "")))
    .forEach(([seat, role]) => {
      const chip = document.createElement("span");
      chip.className = `chip ${role}`;
      chip.textContent = `${seat} · ${role}`;
      ui.rolesList.appendChild(chip);
    });
}

function renderTimeline() {
  const timeline = currentState?.timeline ?? [];
  if (!timeline.length) {
    ui.timeline.textContent = "暂无日志。";
    ui.timeline.classList.add("empty");
    updateExportLogButtonState();
    return;
  }
  ui.timeline.textContent = timeline.join("\n");
  ui.timeline.classList.remove("empty");
  ui.timeline.scrollTop = ui.timeline.scrollHeight;
  updateExportLogButtonState();
}

function buildExportFileName() {
  const gameId = String(currentState?.id ?? "unknown")
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  const timestamp = new Date().toISOString().replace(/\.\d{3}Z$/, "Z").replace(/:/g, "-");
  return `werewolf-log-${gameId || "unknown"}-${timestamp}.md`;
}

function buildTimelineMarkdown() {
  const timelineLines = currentState?.timeline ?? [];
  const timelineText = timelineLines.join("\n").replace(/```/g, "``\\`");
  const alivePlayers = currentState?.alivePlayers?.length ? currentState.alivePlayers.join(", ") : "-";
  const exportedAt = new Date().toISOString();

  return [
    "# AI 狼人杀运行日志",
    "",
    `- 导出时间: ${exportedAt}`,
    `- Game ID: ${currentState?.id ?? "-"}`,
    `- Day: ${currentState?.currentDay ?? "-"}`,
    `- Next Phase: ${currentState?.nextPhase ?? "-"}`,
    `- Finished: ${String(Boolean(currentState?.finished))}`,
    `- Winner: ${currentState?.winner ?? "-"}`,
    `- Alive Players: ${alivePlayers}`,
    "",
    "## 时间线日志",
    "",
    "```text",
    timelineText || "暂无日志。",
    "```",
    "",
  ].join("\n");
}

function exportTimelineAsMarkdown() {
  const timeline = currentState?.timeline ?? [];
  if (!timeline.length) {
    alert("当前没有可导出的时间线日志。");
    updateExportLogButtonState();
    return;
  }

  const markdown = buildTimelineMarkdown();
  const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
  const downloadUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = downloadUrl;
  anchor.download = buildExportFileName();
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(downloadUrl);
}

function renderEvents() {
  const events = currentState?.publicEventLog ?? [];
  ui.eventsBody.innerHTML = "";
  if (!events.length) {
    ui.eventsBody.innerHTML = `<tr><td colspan="5">暂无公共事件</td></tr>`;
    return;
  }
  events.forEach((event) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${event.day}</td>
      <td>${event.phase}</td>
      <td>${event.type}</td>
      <td>${event.speaker}</td>
      <td>${event.content}</td>
    `;
    ui.eventsBody.appendChild(tr);
  });
}

function renderAll() {
  renderStatus();
  renderChips();
  renderTimeline();
  renderEvents();
}

async function createNewGame() {
  setBusy(true);
  try {
    const result = await requestJson("/api/game/new");
    currentState = result.state;
    renderAll();
  } finally {
    setBusy(false);
  }
}

async function stepGame() {
  if (!currentState) return;
  setBusy(true);
  try {
    const result = await requestJson("/api/game/step", { state: currentState });
    currentState = result.state;
    renderAll();
  } finally {
    setBusy(false);
  }
}

async function runGameToEnd() {
  const originalLabel = ui.runBtn.textContent;
  setBusy(true);
  try {
    const maxSteps = Number(ui.maxStepsInput.value) || 24;
    if (!currentState) {
      const result = await requestJson("/api/game/new");
      currentState = result.state;
      renderAll();
    }

    let stepsTaken = 0;
    for (; stepsTaken < maxSteps; stepsTaken += 1) {
      if (!currentState || currentState.finished) break;
      ui.runBtn.textContent = `自动运行中 ${stepsTaken + 1}/${maxSteps}`;
      const result = await requestJson("/api/game/step", { state: currentState });
      currentState = result.state;
      renderAll();
      // Give the browser a moment to paint each intermediate state.
      // eslint-disable-next-line no-await-in-loop
      await new Promise((resolve) => setTimeout(resolve, 60));
    }

    if (!currentState?.finished && stepsTaken >= maxSteps) {
      alert("达到最大步数限制，游戏未结束。可以继续点击“自动跑到结束”。");
    }
  } finally {
    ui.runBtn.textContent = originalLabel;
    setBusy(false);
  }
}

ui.newBtn.addEventListener("click", () => {
  createNewGame().catch((error) => alert(String(error)));
});

ui.stepBtn.addEventListener("click", () => {
  stepGame().catch((error) => alert(String(error)));
});

ui.runBtn.addEventListener("click", () => {
  runGameToEnd().catch((error) => alert(String(error)));
});

ui.exportLogBtn.addEventListener("click", () => {
  exportTimelineAsMarkdown();
});

window.render_game_to_text = () => {
  return JSON.stringify(
    {
      mode: !currentState ? "idle" : currentState.finished ? "finished" : "running",
      day: currentState?.currentDay ?? 0,
      nextPhase: currentState?.nextPhase ?? null,
      alivePlayers: currentState?.alivePlayers ?? [],
      winner: currentState?.winner ?? "none",
      coordinate_system: "not_applicable_seat_based",
    },
    null,
    2,
  );
};

window.advanceTime = async (ms) => {
  if (!currentState || currentState.finished) return;
  const steps = Math.max(1, Math.round(ms / 900));
  for (let i = 0; i < steps; i += 1) {
    if (currentState.finished) break;
    // eslint-disable-next-line no-await-in-loop
    await stepGame();
  }
};

renderAll();
```

## `public/index.html`
```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Werewolf Worker Arena</title>
    <link rel="stylesheet" href="/styles.css" />
  </head>
  <body>
    <div class="noise"></div>
    <main class="app-shell">
      <header class="hero">
        <p class="hero-tag">Worker + Static Assets</p>
        <h1>Werewolf AI Arena</h1>
        <p class="hero-subtitle">
          Cloudflare Worker 驱动的 AI 狼人杀模拟器（OpenAI SDK JS + SiliconFlow）
        </p>
      </header>

      <section class="controls panel">
        <button id="new-game-btn" class="btn btn-primary">新建对局</button>
        <button id="step-btn" class="btn">单步推进</button>
        <button id="run-btn" class="btn btn-accent">自动跑到结束</button>
        <label class="steps">
          最大步数
          <input id="max-steps-input" type="number" min="1" max="128" value="8" />
        </label>
      </section>

      <section class="grid">
        <article class="panel">
          <h2>局面状态</h2>
          <dl id="status-list" class="status-list"></dl>
        </article>
        <article class="panel">
          <h2>存活玩家</h2>
          <div id="alive-list" class="chip-list"></div>
        </article>
        <article class="panel">
          <h2>身份分配（观战）</h2>
          <div id="roles-list" class="chip-list"></div>
        </article>
      </section>

      <section class="panel log-panel">
        <div class="panel-head">
          <h2>时间线日志</h2>
          <button id="export-log-btn" class="btn btn-subtle" type="button" disabled>导出 Markdown</button>
        </div>
        <pre id="timeline" class="timeline empty">点击“新建对局”开始。</pre>
      </section>

      <section class="panel">
        <h2>公共事件</h2>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Day</th>
                <th>Phase</th>
                <th>Type</th>
                <th>Speaker</th>
                <th>Content</th>
              </tr>
            </thead>
            <tbody id="events-body"></tbody>
          </table>
        </div>
      </section>
    </main>
    <script type="module" src="/app.js"></script>
  </body>
</html>
```

## `public/styles.css`
```css
:root {
  --bg-1: #0a1218;
  --bg-2: #121b1f;
  --panel: rgba(16, 28, 36, 0.82);
  --panel-border: rgba(124, 169, 191, 0.22);
  --text: #edf4f7;
  --muted: #98acb6;
  --accent: #dd6b3d;
  --accent-2: #5ec2aa;
  --danger: #ef5d5d;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-height: 100vh;
  font-family: "IBM Plex Sans", "Noto Sans SC", "Hiragino Sans GB", sans-serif;
  color: var(--text);
  background:
    radial-gradient(circle at 15% 20%, #22404c 0%, transparent 38%),
    radial-gradient(circle at 80% 10%, #3a2820 0%, transparent 34%),
    linear-gradient(140deg, var(--bg-1), var(--bg-2));
}

.noise {
  pointer-events: none;
  position: fixed;
  inset: 0;
  background-image: repeating-radial-gradient(circle at 0 0, transparent 0, rgba(255, 255, 255, 0.02) 2px, transparent 4px);
  opacity: 0.25;
}

.app-shell {
  position: relative;
  z-index: 1;
  width: min(1100px, 92vw);
  margin: 2.5rem auto 3rem;
  display: grid;
  gap: 1rem;
}

.hero {
  padding: 1.2rem 1.4rem;
  border-radius: 16px;
  border: 1px solid var(--panel-border);
  background: linear-gradient(120deg, rgba(18, 30, 38, 0.88), rgba(32, 40, 46, 0.74));
  animation: rise 360ms ease both;
}

.hero h1 {
  margin: 0.15rem 0 0.35rem;
  font-family: "Space Grotesk", "Avenir Next", sans-serif;
  letter-spacing: 0.02em;
}

.hero-tag {
  margin: 0;
  color: var(--accent-2);
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.hero-subtitle {
  margin: 0;
  color: var(--muted);
}

.panel {
  background: var(--panel);
  border: 1px solid var(--panel-border);
  border-radius: 14px;
  padding: 1rem;
  backdrop-filter: blur(4px);
  animation: rise 420ms ease both;
}

.panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.panel-head h2 {
  margin: 0;
}

.controls {
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
  align-items: center;
}

.btn {
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.04);
  color: var(--text);
  padding: 0.58rem 0.95rem;
  font: inherit;
  cursor: pointer;
  transition: transform 120ms ease, border-color 120ms ease, background 120ms ease;
}

.btn:hover {
  transform: translateY(-1px);
  border-color: rgba(255, 255, 255, 0.5);
}

.btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.btn-subtle {
  background: rgba(255, 255, 255, 0.02);
  border-color: rgba(255, 255, 255, 0.2);
}

.btn-primary {
  background: linear-gradient(130deg, rgba(94, 194, 170, 0.25), rgba(37, 101, 102, 0.42));
}

.btn-accent {
  background: linear-gradient(130deg, rgba(221, 107, 61, 0.22), rgba(136, 61, 44, 0.42));
}

.steps {
  margin-left: auto;
  display: flex;
  gap: 0.5rem;
  align-items: center;
  color: var(--muted);
  font-size: 0.92rem;
}

.steps input {
  width: 92px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.22);
  background: rgba(0, 0, 0, 0.32);
  color: var(--text);
  padding: 0.38rem 0.42rem;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

h2 {
  margin-top: 0;
  margin-bottom: 0.75rem;
  font-family: "Space Grotesk", "Avenir Next", sans-serif;
  font-size: 1rem;
}

.status-list {
  margin: 0;
  display: grid;
  gap: 0.5rem;
}

.status-list div {
  display: flex;
  justify-content: space-between;
  gap: 0.8rem;
  color: var(--muted);
  border-bottom: 1px dashed rgba(255, 255, 255, 0.12);
  padding-bottom: 0.3rem;
}

.status-list dt {
  font-weight: 600;
}

.status-list dd {
  margin: 0;
  color: var(--text);
  text-align: right;
}

.chip-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.42rem;
}

.chip {
  padding: 0.25rem 0.58rem;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  font-size: 0.85rem;
  background: rgba(0, 0, 0, 0.26);
}

.chip.werewolf {
  border-color: rgba(239, 93, 93, 0.55);
  color: #ffd4d4;
}

.chip.villager {
  border-color: rgba(94, 194, 170, 0.55);
  color: #d8fff4;
}

.log-panel .btn {
  padding: 0.35rem 0.75rem;
  font-size: 0.82rem;
}

.timeline {
  margin: 0;
  max-height: 340px;
  overflow: auto;
  background: rgba(0, 0, 0, 0.35);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  padding: 0.75rem;
  white-space: pre-wrap;
  line-height: 1.45;
  font-family: "JetBrains Mono", "SFMono-Regular", Consolas, monospace;
  font-size: 0.83rem;
}

.timeline.empty {
  color: var(--muted);
}

.table-wrap {
  overflow: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

th,
td {
  border-bottom: 1px solid rgba(255, 255, 255, 0.11);
  text-align: left;
  padding: 0.5rem 0.45rem;
  vertical-align: top;
}

th {
  color: var(--muted);
  font-weight: 600;
}

@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 980px) {
  .grid {
    grid-template-columns: 1fr;
  }

  .steps {
    width: 100%;
    margin-left: 0;
    justify-content: space-between;
  }
}
```

## `src/game.ts`
```typescript
import OpenAI from "openai";

type Role = "werewolf" | "villager";
type Winner = "werewolves" | "villagers" | "none";
type Phase = "day" | "night";
type VoteStyleKey = "conservative" | "pressure" | "contrarian" | "logic_driven";

export interface EnvVars {
  SILICONFLOW_API_KEY?: string;
  SILICONFLOW_MODEL?: string;
  SILICONFLOW_BASE_URL?: string;
}

export interface PublicEvent {
  type: string;
  speaker: string;
  content: string;
  day: number;
  phase: Phase;
  alive: string[];
  [key: string]: unknown;
}

interface FinalVote {
  target: string;
  changed_vote: boolean;
  why_change: string | null;
}

export interface GameState {
  id: string;
  roles: Record<string, Role>;
  alivePlayers: string[];
  currentDay: number;
  nextPhase: Phase;
  votingStyles: Record<string, VoteStyleKey>;
  playerObservations: Record<string, string>;
  publicEventLog: PublicEvent[];
  timeline: string[];
  finished: boolean;
  winner: Winner;
  lastUpdatedAt: string;
}

const TOTAL_PLAYERS = 8;
const WEREWOLF_COUNT = 2;
const PLAYER_NAMES = Array.from({ length: TOTAL_PLAYERS }, (_, i) => `Seat${i + 1}`);

const VOTING_STYLE_CARDS: Record<
  VoteStyleKey,
  { name: string; rules: string; scenarios: string[] }
> = {
  conservative: {
    name: "保守谨慎型",
    rules: "无确凿证据时弃票（投给自己），不急于站队",
    scenarios: [
      "场景1：Day 1 没有人提出实质性指控时，选择观望",
      "场景2：看到多人互相指控但逻辑都薄弱时，不急于站队",
    ],
  },
  pressure: {
    name: "施压型",
    rules: "Day 1 倾向投票给理由最弱的发言者",
    scenarios: [
      "场景1：某人的发言仅为“我觉得 XXX 可疑”而无具体行为时，优先投他",
      "场景2：多人保持观望时，主动制造压力迫使表态",
    ],
  },
  contrarian: {
    name: "反共识型",
    rules:
      "当多人迅速聚焦同一目标时，优先评估“最早提出主叙事的人”而非直接投给被聚焦者",
    scenarios: [
      "场景1：看到 3 人同投 Seat1 时，检查谁最先指控 Seat1，评估其是否在带节奏",
      "场景2：不直接投给被聚焦者，而是投给“造势者”",
    ],
  },
  logic_driven: {
    name: "逻辑驱动型",
    rules: "优先抓自相矛盾或论据跳跃的发言",
    scenarios: [
      "场景1：发现某人前后发言矛盾（例如先说观察 XXX 后又投 XXX），标记为可疑",
      "场景2：某人论据从行为 A 跳到行为 B 而无逻辑链条，重点怀疑",
    ],
  },
};

const DEFAULT_VOTING_STYLES: Record<string, VoteStyleKey> = {
  Seat1: "conservative",
  Seat2: "logic_driven",
  Seat3: "contrarian",
  Seat4: "pressure",
  Seat5: "conservative",
  Seat6: "logic_driven",
  Seat7: "contrarian",
  Seat8: "pressure",
};

const GAME_MASTER_SYSTEM_PROMPT = `
# 狼人杀游戏管理员 (GameMaster)

你是狼人杀游戏的 Game Master（游戏管理员），负责推进游戏流程和裁决胜负。
你只需要输出 JSON，不要输出额外文本。
`;

const PLAYER_SYSTEM_TEMPLATE = `
# 狼人杀游戏：你是一名玩家

## 当前处境

你现在身处一个有8名玩家的村庄，其中有2名隐藏的狼人。
- 你的座位号：**{player_name}**（你就是这个玩家）
- 你的身份：**{role}**
- 你知道的信息：{role_info}
- 其他玩家：Seat1 - Seat8

## 你的投票风格

你是 {style_name} 型玩家。

规则：{style_rules}

场景示例：
{style_scenarios}

## 你不知道的信息

除了身份卡透露的信息外，你不知道任何人的真实身份。
你只能通过他们的发言、投票、行为来判断谁是敌人。
你必须承认自己不知道，不能假装确定或编造不存在的信息。
你必须始终把“我”理解为 {player_name} 本人。
白天发言时禁止怀疑或指控自己；投票时允许因观望投给自己，但这不等同于自我指控。

## 夜晚发生什么

{night_action}

## 输出格式

请以 JSON 格式回复：
{
  "action": "speech | vote | night_action",
  "target": "Seat1 | Seat2 | Seat3 | Seat4 | Seat5 | Seat6 | Seat7 | Seat8",
  "content": "你的发言内容或决策理由（<=120字）",
  "confidence": "high | medium | low",
  "risk_if_wrong": "如果投错会导致什么后果（投票时必须填写）",
  "alt_target": "备选目标（不确定时可填自己）",
  "changed_vote": false,
  "why_change": ""
}
`;

function nowISO(): string {
  return new Date().toISOString();
}

function cloneState(state: GameState): GameState {
  return structuredClone(state);
}

function seatNumber(seat: string): number {
  const match = seat.match(/\d+/);
  return match ? Number(match[0]) : Number.MAX_SAFE_INTEGER;
}

function sortSeats(seats: string[]): string[] {
  return [...seats].sort((a, b) => seatNumber(a) - seatNumber(b));
}

function chooseRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function asBoolean(value: unknown, fallback = false): boolean {
  if (typeof value === "boolean") {
    return value;
  }
  if (typeof value === "string") {
    return value.toLowerCase() === "true";
  }
  return fallback;
}

function isSeat(value: string): boolean {
  return PLAYER_NAMES.includes(value);
}

function parseJSONFromText(text: string): Record<string, unknown> {
  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    // continue
  }

  const fencedJson = text.match(/```json\s*([\s\S]*?)```/i);
  if (fencedJson?.[1]) {
    try {
      return JSON.parse(fencedJson[1].trim()) as Record<string, unknown>;
    } catch {
      // continue
    }
  }

  const fenced = text.match(/```\s*([\s\S]*?)```/);
  if (fenced?.[1]) {
    const body = fenced[1].replace(/^json/i, "").trim();
    try {
      return JSON.parse(body) as Record<string, unknown>;
    } catch {
      // continue
    }
  }

  const first = text.indexOf("{");
  if (first !== -1) {
    let depth = 0;
    for (let i = first; i < text.length; i += 1) {
      if (text[i] === "{") depth += 1;
      if (text[i] === "}") {
        depth -= 1;
        if (depth === 0) {
          const candidate = text.slice(first, i + 1);
          try {
            return JSON.parse(candidate) as Record<string, unknown>;
          } catch {
            break;
          }
        }
      }
    }
  }

  throw new Error("无法从模型输出中提取有效 JSON");
}

function appendTimeline(state: GameState, line: string): void {
  state.timeline.push(line);
  if (state.timeline.length > 5000) {
    state.timeline = state.timeline.slice(-5000);
  }
}

function addEvent(
  state: GameState,
  eventType: string,
  speaker: string,
  content: string,
  phase: Phase,
  extra: Record<string, unknown> = {},
): void {
  state.publicEventLog.push({
    type: eventType,
    speaker,
    content,
    day: state.currentDay,
    phase,
    alive: [...state.alivePlayers],
    ...extra,
  });
}

function formatRole(role: Role): string {
  return role === "werewolf" ? "🐺 狼人" : "👤 村民";
}

function extractObservation(content: string): string | null {
  const keywords = ["观察", "关注", "留意", "重点", "盯着"];
  for (const keyword of keywords) {
    const idx = content.indexOf(keyword);
    if (idx !== -1) {
      return content
        .slice(idx, idx + 30)
        .replaceAll("，", "、")
        .replaceAll("。", "")
        .trim();
    }
  }
  return null;
}

function normalizeSpeechText(text: string): string {
  return text.replace(/\s+/g, "");
}

function hasSelfSuspicionSpeech(playerName: string, content: string): boolean {
  const normalized = normalizeSpeechText(content);
  const directSelfPatterns = [
    "我怀疑自己",
    "我觉得自己可疑",
    "我认为自己是狼",
    `我怀疑${playerName}`,
    `我觉得${playerName}可疑`,
    `我认为${playerName}是狼`,
    `我会投${playerName}`,
    `我投${playerName}`,
    `优先怀疑${playerName}`,
    `优先投${playerName}`,
  ];
  return directSelfPatterns.some((pattern) => normalized.includes(pattern));
}

function validateSpeechOutput(
  playerName: string,
  content: string,
  target: string,
  alivePlayers: string[],
  currentDay: number,
): string | null {
  if (!content.trim()) {
    return "发言内容为空";
  }

  if (currentDay > 1) {
    if (!target || !isSeat(target)) {
      return "缺少有效怀疑目标 target";
    }
    if (!alivePlayers.includes(target)) {
      return "怀疑目标不是存活玩家";
    }
    if (target === playerName) {
      return "怀疑目标不能是自己";
    }
  }

  if (hasSelfSuspicionSpeech(playerName, content)) {
    return "发言内容包含自我怀疑";
  }

  return null;
}

function chooseFallbackSpeechTarget(playerName: string, alivePlayers: string[]): string {
  return alivePlayers.find((seat) => seat !== playerName) ?? playerName;
}

function buildFallbackSpeech(
  playerName: string,
  alivePlayers: string[],
  currentDay: number,
): { content: string; target: string } {
  const fallbackTarget = chooseFallbackSpeechTarget(playerName, alivePlayers);

  if (fallbackTarget === playerName) {
    return {
      target: playerName,
      content: "目前信息不足，我先保持观望。",
    };
  }

  if (currentDay === 1) {
    return {
      target: fallbackTarget,
      content: `第一天信息有限，我先观望，但会重点关注 ${fallbackTarget} 后续发言与投票是否一致。`,
    };
  }

  return {
    target: fallbackTarget,
    content: `我暂时怀疑 ${fallbackTarget}，其发言与投票逻辑存在跳跃，我会继续观察后续一致性。`,
  };
}

function checkWinCondition(state: GameState): Winner {
  const aliveWerewolves = state.alivePlayers.filter((p) => state.roles[p] === "werewolf").length;
  const aliveVillagers = state.alivePlayers.filter((p) => state.roles[p] === "villager").length;
  if (aliveWerewolves === 0) return "villagers";
  if (aliveWerewolves >= aliveVillagers) return "werewolves";
  return "none";
}

function hasChangedVote(initialTarget: string, finalTarget: string): boolean {
  return initialTarget !== finalTarget;
}

function isValidVoteChange(changedVote: boolean, whyChange?: string | null): boolean {
  if (!changedVote) return true;
  if (!whyChange) return false;
  return whyChange.trim().length >= 5;
}

function generateVoteDistribution(votes: Record<string, string | null>): string {
  if (!Object.keys(votes).length) {
    return "📊 第一轮投票结果（票型分布）：\n  （无投票数据）";
  }

  const counts: Record<string, number> = {};
  for (const target of Object.values(votes)) {
    if (target) {
      counts[target] = (counts[target] ?? 0) + 1;
    }
  }

  if (!Object.keys(counts).length) {
    return "📊 第一轮投票结果（票型分布）：\n  （无有效投票）";
  }

  const lines = Object.entries(counts)
    .sort((a, b) => {
      if (b[1] !== a[1]) return b[1] - a[1];
      return seatNumber(a[0]) - seatNumber(b[0]);
    })
    .map(([target, count]) => `  ${target}: ${count}票`);

  return ["📊 第一轮投票结果（票型分布）：", ...lines].join("\n");
}

function buildPlayerSystemMessage(
  playerName: string,
  state: GameState,
): string {
  const role = state.roles[playerName];
  const style = VOTING_STYLE_CARDS[state.votingStyles[playerName]];

  let roleInfo = "你是村民。你不知道其他任何人的身份。";
  let nightAction = "夜晚时，村民没有行动，请等待天亮。";

  if (role === "werewolf") {
    const teammates = PLAYER_NAMES.filter((p) => state.roles[p] === "werewolf" && p !== playerName);
    roleInfo = `你是狼人。你的同伴是：${teammates.join(", ") || "（无）"}`;
    nightAction = "夜晚时，与同伴商议并选择一个村民进行击杀。";
  }

  return PLAYER_SYSTEM_TEMPLATE.replace("{player_name}", playerName)
    .replace("{role}", role)
    .replace("{role_info}", roleInfo)
    .replace("{style_name}", style.name)
    .replace("{style_rules}", style.rules)
    .replace("{style_scenarios}", style.scenarios.join("\n"))
    .replace("{night_action}", nightAction);
}

function requireModelEnv(env: EnvVars): { apiKey: string; model: string; baseURL: string } {
  const missing: string[] = [];
  if (!env.SILICONFLOW_API_KEY) missing.push("SILICONFLOW_API_KEY");
  if (!env.SILICONFLOW_MODEL) missing.push("SILICONFLOW_MODEL");
  if (!env.SILICONFLOW_BASE_URL) missing.push("SILICONFLOW_BASE_URL");
  if (missing.length) {
    throw new Error(`缺少环境变量：${missing.join(", ")}`);
  }
  return {
    apiKey: env.SILICONFLOW_API_KEY!,
    model: env.SILICONFLOW_MODEL!,
    baseURL: env.SILICONFLOW_BASE_URL!,
  };
}

async function callJSONModel(
  client: OpenAI,
  model: string,
  systemMessage: string,
  task: string,
): Promise<Record<string, unknown>> {
  const base = {
    model,
    messages: [
      { role: "system" as const, content: systemMessage },
      { role: "user" as const, content: task },
    ],
    temperature: 0.7,
  };

  let content = "";
  try {
    const response = await client.chat.completions.create({
      ...base,
      response_format: { type: "json_object" },
    });
    content = asString(response.choices[0]?.message?.content, "");
  } catch {
    const response = await client.chat.completions.create(base);
    content = asString(response.choices[0]?.message?.content, "");
  }

  if (!content) {
    throw new Error("模型返回空内容");
  }
  return parseJSONFromText(content);
}

async function getPlayerResponse(
  state: GameState,
  client: OpenAI,
  model: string,
  playerName: string,
  task: string,
): Promise<Record<string, unknown>> {
  const systemMessage = buildPlayerSystemMessage(playerName, state);
  return callJSONModel(client, model, systemMessage, task);
}

async function getGmResponse(
  client: OpenAI,
  model: string,
  task: string,
): Promise<Record<string, unknown>> {
  return callJSONModel(client, model, GAME_MASTER_SYSTEM_PROMPT, task);
}

async function runNightPhase(
  state: GameState,
  client: OpenAI,
  model: string,
): Promise<void> {
  appendTimeline(state, `\n${"=".repeat(70)}`);
  appendTimeline(state, `🌙 第 ${state.currentDay} 天 - 夜晚`);
  appendTimeline(state, `${"=".repeat(70)}\n`);

  const aliveWerewolves = sortSeats(
    state.alivePlayers.filter((player) => state.roles[player] === "werewolf"),
  );

  if (!aliveWerewolves.length) {
    appendTimeline(state, "💀 没有存活狼人，今晚平安夜");
    addEvent(state, "announcement", "GameMaster", "今晚平安夜，无人死亡", "night");
    return;
  }

  appendTimeline(state, `🐺 狼人行动中...（${aliveWerewolves.join(", ")}）`);

  const targets: Record<string, string | null> = {};

  for (const werewolf of aliveWerewolves) {
    const teammates = aliveWerewolves.filter((p) => p !== werewolf);
    let task = [
      `现在是第 ${state.currentDay} 天夜晚。`,
      "",
      `你是狼人。你的同伴：${teammates.join(", ") || "（无）"}`,
      `当前存活玩家：${sortSeats(state.alivePlayers).join(", ")}`,
      "请选择今晚的击杀目标。",
      "小提示：过于完美的推理可能引起注意，偶尔保持模糊更安全。",
    ].join("\n");

    if (state.playerObservations[werewolf]) {
      task += `\n你之前关注的观察对象：${state.playerObservations[werewolf]}`;
    }

    try {
      const response = await getPlayerResponse(state, client, model, werewolf, task);
      let target = asString(response.target);

      if (!state.alivePlayers.includes(target) || state.roles[target] === "werewolf") {
        const validTargets = state.alivePlayers.filter((p) => state.roles[p] !== "werewolf");
        target = validTargets.length ? chooseRandom(validTargets) : "";
        appendTimeline(state, `⚠️ ${werewolf} 选择无效目标，已随机修正为 ${target || "无"}`);
      }
      targets[werewolf] = target || null;
      appendTimeline(state, `🐺 ${werewolf} → ${target || "无"}`);
    } catch (error) {
      const validTargets = state.alivePlayers.filter((p) => state.roles[p] !== "werewolf");
      targets[werewolf] = validTargets.length ? chooseRandom(validTargets) : null;
      appendTimeline(state, `❌ ${werewolf} 夜晚行动失败：${String(error)}`);
    }
  }

  const targetCount: Record<string, number> = {};
  for (const target of Object.values(targets)) {
    if (target) {
      targetCount[target] = (targetCount[target] ?? 0) + 1;
    }
  }

  appendTimeline(state, `\n${"─".repeat(70)}`);
  appendTimeline(state, "🌙 击杀结果");
  appendTimeline(state, `${"─".repeat(70)}`);

  if (!Object.keys(targetCount).length) {
    appendTimeline(state, "💀 今晚无人死亡");
    addEvent(state, "announcement", "GameMaster", "今晚无人死亡", "night");
    return;
  }

  const maxCount = Math.max(...Object.values(targetCount));
  const finalists = Object.entries(targetCount)
    .filter(([, count]) => count === maxCount)
    .map(([seat]) => seat);
  const finalTarget = finalists.sort((a, b) => seatNumber(a) - seatNumber(b))[0];

  state.alivePlayers = state.alivePlayers.filter((p) => p !== finalTarget);
  appendTimeline(state, `💀 ${finalTarget} 被狼人杀害`);
  addEvent(state, "death", "GameMaster", `${finalTarget} 被狼人杀害`, "night");
}

async function runDayPhase(
  state: GameState,
  client: OpenAI,
  model: string,
): Promise<void> {
  appendTimeline(state, `\n${"=".repeat(70)}`);
  appendTimeline(state, `☀️ 第 ${state.currentDay} 天 - 白天`);
  appendTimeline(state, `${"=".repeat(70)}\n`);

  const speeches: Record<string, string> = {};
  const aliveSorted = sortSeats(state.alivePlayers);

  for (const playerName of aliveSorted) {
    const taskParts: string[] = [
      `现在是第 ${state.currentDay} 天白天。`,
      `你当前座位：${playerName}（你就是“我”）`,
      `你的身份：${state.roles[playerName]}`,
      `当前存活玩家：${aliveSorted.join(", ")}`,
      "",
    ];

    if (Object.keys(speeches).length) {
      taskParts.push("之前的发言记录：");
      taskParts.push(JSON.stringify(speeches, null, 2));
      taskParts.push("");
    }

    if (state.currentDay > 1 && state.playerObservations[playerName]) {
      taskParts.push(`你观察的重点是：${state.playerObservations[playerName]}`);
      taskParts.push("");
    }

    if (state.currentDay === 1) {
      taskParts.push("请进行你的发言（<=120字）。你可以点名怀疑对象并给理由，或说明暂时观望。");
      taskParts.push(`如果你点名怀疑对象，target 不能是你自己（${playerName}）。`);
    } else {
      taskParts.push("请进行你的发言（<=120字），必须包含怀疑对象和理由。");
      taskParts.push(`必须在 target 字段填写你怀疑的存活玩家，且 target 不能是你自己（${playerName}）。`);
    }
    taskParts.push("禁止出现“我怀疑自己 / 我觉得自己像狼 / 我投自己因为我是狼”这类自我指控。");

    if (state.roles[playerName] === "werewolf") {
      taskParts.push("小提示：过于完美的推理可能引起注意，偶尔保持模糊更安全。");
    }

    try {
      const baseTask = taskParts.join("\n");
      const response = await getPlayerResponse(
        state,
        client,
        model,
        playerName,
        baseTask,
      );
      let content = asString(response.content, "（发言失败）").trim() || "（发言失败）";
      let target = asString(response.target, "").trim();
      let speechIssue = validateSpeechOutput(
        playerName,
        content,
        target,
        aliveSorted,
        state.currentDay,
      );

      if (speechIssue) {
        appendTimeline(state, `⚠️ ${playerName} 发言触发约束（${speechIssue}），请求纠错重试`);
        const retryTask = [
          baseTask,
          "",
          "纠错要求：",
          `- 你就是 ${playerName}，不得怀疑或指控自己`,
          state.currentDay > 1
            ? "- 你必须在 target 字段给出一个不是自己的存活玩家"
            : "- 你可以观望，但若点名怀疑对象，必须是其他存活玩家",
          `- 你上一版 target：${target || "（空）"}`,
          `- 你上一版发言：${content}`,
          "请重新输出 JSON。",
        ].join("\n");
        const retry = await getPlayerResponse(
          state,
          client,
          model,
          playerName,
          retryTask,
        );
        content = asString(retry.content, "（发言失败）").trim() || "（发言失败）";
        target = asString(retry.target, "").trim();
        speechIssue = validateSpeechOutput(
          playerName,
          content,
          target,
          aliveSorted,
          state.currentDay,
        );

        if (speechIssue) {
          const fallback = buildFallbackSpeech(playerName, aliveSorted, state.currentDay);
          content = fallback.content;
          appendTimeline(state, `⚠️ ${playerName} 二次发言仍违规（${speechIssue}），已使用保底发言`);
        } else {
          appendTimeline(state, `✅ ${playerName} 纠错重试成功`);
        }
      }

      speeches[playerName] = content;

      appendTimeline(state, `🗣️ ${playerName}: ${content}`);
      addEvent(state, "speech", playerName, content, "day");

      const observation = extractObservation(content);
      if (observation) {
        state.playerObservations[playerName] = observation;
      }
    } catch (error) {
      speeches[playerName] = "（发言失败）";
      appendTimeline(state, `❌ ${playerName} 发言失败：${String(error)}`);
    }
  }

  let daySummary = "（摘要生成失败，请基于现有信息判断）";
  try {
    const gmTask = [
      `请为第 ${state.currentDay} 天的发言生成投票摘要。`,
      "以下是今天所有存活玩家的发言：",
      JSON.stringify(speeches, null, 2),
      "请生成仅包含事实的摘要（<=6行），不要表达立场。",
    ].join("\n");
    const gmResponse = await getGmResponse(client, model, gmTask);
    daySummary = asString(gmResponse.summary, daySummary);
  } catch (error) {
    appendTimeline(state, `⚠️ GM 摘要生成失败：${String(error)}`);
  }

  appendTimeline(state, `📋 GM摘要：\n${daySummary}`);
  appendTimeline(state, "");

  const initialVotes: Record<string, string | null> = {};
  const recentDeath = [...state.publicEventLog]
    .reverse()
    .find((event) => event.type === "death" && event.phase === "night");

  appendTimeline(state, `${"─".repeat(70)}`);
  appendTimeline(state, "🗳️ 【第一轮：私下初投】");
  appendTimeline(state, `${"─".repeat(70)}`);

  for (const playerName of aliveSorted) {
    const taskParts = [
      `现在是第 ${state.currentDay} 天白天【第一轮：初投】。`,
      `你的身份：${state.roles[playerName]}`,
      `当前存活玩家：${aliveSorted.join(", ")}`,
      "",
      "GM公共公告摘要：",
      daySummary,
      "",
      `你今天的发言："${speeches[playerName] ?? "（无）"}"`,
      "",
      "投票约束：",
      "- 这是第一轮私下投票，结果不会立即公开",
      "- 你必须在 risk_if_wrong 字段填写投错的代价",
      "- 如果你无法写清 risk_if_wrong，请投给自己且 confidence=low",
      "- 不要盲目跟风，基于摘要和你自己的发言决策",
      "",
      "请投票给你认为最可能是狼人的玩家，或投给自己表示观望。",
    ];

    if (recentDeath) {
      taskParts.push(`最近一次死亡：${recentDeath.content}`);
    }
    if (state.playerObservations[playerName]) {
      taskParts.push(`记住你要观察的对象：${state.playerObservations[playerName]}`);
    }

    try {
      const response = await getPlayerResponse(
        state,
        client,
        model,
        playerName,
        taskParts.join("\n"),
      );

      let target = asString(response.target, playerName);
      let confidence = asString(response.confidence, "medium").toLowerCase();
      const riskIfWrong = asString(response.risk_if_wrong, "");

      if (!riskIfWrong.trim()) {
        target = playerName;
        confidence = "low";
      }

      if (!state.alivePlayers.includes(target)) {
        target = playerName;
      }

      if (confidence === "low" && Math.random() < 0.5) {
        target = playerName;
      }

      initialVotes[playerName] = target;
    } catch (error) {
      appendTimeline(state, `❌ ${playerName} 第一轮投票失败：${String(error)}，默认弃票`);
      initialVotes[playerName] = playerName;
    }
  }

  const voteDistribution = generateVoteDistribution(initialVotes);
  appendTimeline(state, voteDistribution);
  appendTimeline(state, "💡 第一轮投票已结束，现在进入第二轮终投。");
  appendTimeline(state, "");

  appendTimeline(state, `${"─".repeat(70)}`);
  appendTimeline(state, "🗳️ 【第二轮：私下终投】");
  appendTimeline(state, `${"─".repeat(70)}`);

  const finalVotes: Record<string, FinalVote> = {};

  for (const playerName of aliveSorted) {
    const taskParts = [
      `现在是第 ${state.currentDay} 天白天【第二轮：终投】。`,
      `你的身份：${state.roles[playerName]}`,
      `当前存活玩家：${aliveSorted.join(", ")}`,
      "",
      "GM公共公告摘要：",
      daySummary,
      "",
      voteDistribution,
      "",
      `你第一轮投给了：${initialVotes[playerName] ?? playerName}`,
      `你今天的发言："${speeches[playerName] ?? "（无）"}"`,
      "",
      "投票约束：",
      "- 你可以看到第一轮票型分布，据此调整决策",
      "- 改票时 changed_vote 必须为 true",
      "- 改票时 why_change 必须>=5字，否则改票无效",
      "- 不改票时 changed_vote=false，why_change 为空",
      "",
      "请进行你的终投。",
    ];

    if (recentDeath) {
      taskParts.push(`最近一次死亡：${recentDeath.content}`);
    }
    if (state.playerObservations[playerName]) {
      taskParts.push(`记住你要观察的对象：${state.playerObservations[playerName]}`);
    }

    try {
      const response = await getPlayerResponse(
        state,
        client,
        model,
        playerName,
        taskParts.join("\n"),
      );
      let target = asString(response.target, playerName);
      let changedVote = asBoolean(response.changed_vote, false);
      let whyChange = asString(response.why_change, "");

      if (!state.alivePlayers.includes(target)) {
        target = playerName;
      }

      const initialTarget = initialVotes[playerName] ?? playerName;
      const actualChanged = hasChangedVote(initialTarget, target);
      if (!actualChanged && changedVote) {
        changedVote = false;
        whyChange = "";
      }

      const validChange = isValidVoteChange(changedVote, whyChange);
      if (actualChanged && changedVote && !validChange) {
        finalVotes[playerName] = {
          target: initialTarget,
          changed_vote: false,
          why_change: null,
        };
        appendTimeline(state, `⚠️ ${playerName} 改票理由不足，改票无效，保留第一轮票数`);
      } else {
        finalVotes[playerName] = {
          target,
          changed_vote: actualChanged ? changedVote : false,
          why_change: whyChange.trim() ? whyChange.trim() : null,
        };
        const changedTag = finalVotes[playerName].changed_vote ? " (改票)" : "";
        appendTimeline(state, `🗳️ ${playerName} → ${target}${changedTag}`);
        if (finalVotes[playerName].changed_vote && finalVotes[playerName].why_change) {
          appendTimeline(state, `   理由：${finalVotes[playerName].why_change}`);
        }
      }
    } catch (error) {
      appendTimeline(state, `❌ ${playerName} 第二轮投票失败：${String(error)}，使用第一轮票数`);
      finalVotes[playerName] = {
        target: initialVotes[playerName] ?? playerName,
        changed_vote: false,
        why_change: null,
      };
    }
  }

  appendTimeline(state, `${"─".repeat(70)}`);
  appendTimeline(state, "📊 投票统计");
  appendTimeline(state, `${"─".repeat(70)}`);

  const changedCount = Object.values(finalVotes).filter((vote) => vote.changed_vote).length;
  appendTimeline(state, `📈 改票统计：${changedCount} 名玩家改变了投票`);

  const voteCounts: Record<string, number> = {};
  for (const vote of Object.values(finalVotes)) {
    voteCounts[vote.target] = (voteCounts[vote.target] ?? 0) + 1;
  }

  for (const [player, count] of Object.entries(voteCounts).sort((a, b) => seatNumber(a[0]) - seatNumber(b[0]))) {
    appendTimeline(state, `  ${player}: ${count} 票`);
  }

  const maxVotes = Math.max(...Object.values(voteCounts));
  const eliminated = Object.entries(voteCounts)
    .filter(([, count]) => count === maxVotes)
    .map(([player]) => player);

  if (eliminated.length === 1) {
    const eliminatedPlayer = eliminated[0];
    state.alivePlayers = state.alivePlayers.filter((p) => p !== eliminatedPlayer);
    appendTimeline(state, `💀 ${eliminatedPlayer} 被处决（${formatRole(state.roles[eliminatedPlayer])}）`);
    addEvent(state, "death", "GameMaster", `${eliminatedPlayer} 被投票处决`, "day");
  } else {
    appendTimeline(state, `⚖️ 平票（${eliminated.join(", ")}），无人被处决`);
  }

  if (state.currentDay === 1) {
    const topVotes = Math.max(...Object.values(voteCounts));
    const targetCount = Object.keys(voteCounts).length;
    if (topVotes <= 4 || targetCount >= 4) {
      appendTimeline(state, `✅ Day1 投票分散度：高（最高票：${topVotes}，目标数：${targetCount}）`);
    } else {
      appendTimeline(state, `⚠️ Day1 投票分散度：低（最高票：${topVotes}，目标数：${targetCount}）`);
    }
  }
}

export function createNewGameState(): GameState {
  const roles: Role[] = [
    ...Array.from({ length: WEREWOLF_COUNT }, () => "werewolf" as const),
    ...Array.from({ length: TOTAL_PLAYERS - WEREWOLF_COUNT }, () => "villager" as const),
  ];
  const shuffled = [...roles].sort(() => Math.random() - 0.5);

  const roleMap: Record<string, Role> = {};
  for (let i = 0; i < PLAYER_NAMES.length; i += 1) {
    roleMap[PLAYER_NAMES[i]] = shuffled[i];
  }

  const state: GameState = {
    id: crypto.randomUUID(),
    roles: roleMap,
    alivePlayers: [...PLAYER_NAMES],
    currentDay: 0,
    nextPhase: "night",
    votingStyles: { ...DEFAULT_VOTING_STYLES },
    playerObservations: {},
    publicEventLog: [],
    timeline: [],
    finished: false,
    winner: "none",
    lastUpdatedAt: nowISO(),
  };

  appendTimeline(state, `${"=".repeat(70)}`);
  appendTimeline(state, "🐺 AI 狼人杀 Worker 版 - 游戏初始化");
  appendTimeline(state, `${"=".repeat(70)}`);
  appendTimeline(state, "📋 身份分配：");
  for (const seat of sortSeats(PLAYER_NAMES)) {
    appendTimeline(state, `  ${seat}: ${formatRole(state.roles[seat])}`);
  }
  appendTimeline(state, `👥 存活玩家：${sortSeats(state.alivePlayers).join(", ")}`);
  return state;
}

export function coerceState(input: unknown): GameState {
  if (!input || typeof input !== "object") {
    throw new Error("state 无效：必须是对象");
  }
  const candidate = input as Partial<GameState>;
  if (!candidate.roles || !candidate.alivePlayers || !candidate.nextPhase) {
    throw new Error("state 缺少关键字段");
  }

  const roles: Record<string, Role> = {};
  for (const seat of PLAYER_NAMES) {
    const role = (candidate.roles as Record<string, Role>)[seat];
    roles[seat] = role === "werewolf" ? "werewolf" : "villager";
  }

  const alivePlayers = sortSeats(
    (candidate.alivePlayers ?? []).filter((player): player is string => typeof player === "string" && isSeat(player)),
  );

  return {
    id: candidate.id ?? crypto.randomUUID(),
    roles,
    alivePlayers,
    currentDay: typeof candidate.currentDay === "number" ? candidate.currentDay : 0,
    nextPhase: candidate.nextPhase === "day" ? "day" : "night",
    votingStyles: { ...DEFAULT_VOTING_STYLES, ...(candidate.votingStyles ?? {}) },
    playerObservations: { ...(candidate.playerObservations ?? {}) },
    publicEventLog: Array.isArray(candidate.publicEventLog) ? candidate.publicEventLog : [],
    timeline: Array.isArray(candidate.timeline) ? candidate.timeline : [],
    finished: Boolean(candidate.finished),
    winner:
      candidate.winner === "villagers" || candidate.winner === "werewolves" ? candidate.winner : "none",
    lastUpdatedAt: candidate.lastUpdatedAt ?? nowISO(),
  };
}

export async function runOneStep(stateInput: GameState, env: EnvVars): Promise<GameState> {
  const state = cloneState(stateInput);
  if (state.finished) return state;

  const { apiKey, model, baseURL } = requireModelEnv(env);
  const client = new OpenAI({
    apiKey,
    baseURL,
  });

  if (state.nextPhase === "night") {
    await runNightPhase(state, client, model);
    const winner = checkWinCondition(state);
    if (winner !== "none") {
      state.finished = true;
      state.winner = winner;
    } else {
      state.currentDay = state.currentDay === 0 ? 1 : state.currentDay + 1;
      state.nextPhase = "day";
    }
  } else {
    await runDayPhase(state, client, model);
    const winner = checkWinCondition(state);
    if (winner !== "none") {
      state.finished = true;
      state.winner = winner;
    } else {
      state.nextPhase = "night";
    }
  }

  if (state.finished) {
    appendTimeline(state, `${"=".repeat(70)}`);
    if (state.winner === "werewolves") {
      appendTimeline(state, "🐺 狼人获胜！");
    } else {
      appendTimeline(state, "👤 村民获胜！");
    }
    appendTimeline(state, `${"=".repeat(70)}`);
  }

  state.lastUpdatedAt = nowISO();
  return state;
}

export async function runToEnd(
  stateInput: GameState,
  env: EnvVars,
  maxSteps = 24,
): Promise<{ state: GameState; reachedStepLimit: boolean }> {
  let state = cloneState(stateInput);
  let reachedStepLimit = false;

  for (let i = 0; i < maxSteps; i += 1) {
    if (state.finished) break;
    state = await runOneStep(state, env);
  }

  if (!state.finished) {
    reachedStepLimit = true;
  }

  return { state, reachedStepLimit };
}
```

## `src/index.ts`
```typescript
import {
  coerceState,
  createNewGameState,
  runOneStep,
  runToEnd,
  type EnvVars,
} from "./game";

interface Env extends EnvVars {
  ASSETS: Fetcher;
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

async function readBody<T>(request: Request): Promise<T> {
  if (!request.body) return {} as T;
  try {
    return (await request.json()) as T;
  } catch {
    throw new Error("请求体必须是 JSON");
  }
}

async function handleApi(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);

  if (request.method === "GET" && url.pathname === "/api/health") {
    return json({
      ok: true,
      now: new Date().toISOString(),
      hasApiKey: Boolean(env.SILICONFLOW_API_KEY),
      model: env.SILICONFLOW_MODEL ?? null,
      baseUrl: env.SILICONFLOW_BASE_URL ?? null,
    });
  }

  if (request.method === "POST" && url.pathname === "/api/game/new") {
    return json({
      state: createNewGameState(),
    });
  }

  if (request.method === "POST" && url.pathname === "/api/game/step") {
    try {
      const body = await readBody<{ state: unknown }>(request);
      const state = coerceState(body.state);
      const updated = await runOneStep(state, env);
      return json({ state: updated });
    } catch (error) {
      return json({ error: String(error) }, 400);
    }
  }

  if (request.method === "POST" && url.pathname === "/api/game/run") {
    try {
      const body = await readBody<{ state?: unknown; maxSteps?: number }>(request);
      const state = body.state ? coerceState(body.state) : createNewGameState();
      // Keep server-side batch runs conservative to avoid very long edge requests.
      const maxSteps = Number.isFinite(body.maxSteps) ? Math.max(1, Math.min(8, Number(body.maxSteps))) : 4;
      const result = await runToEnd(state, env, maxSteps);
      return json(result);
    } catch (error) {
      return json({ error: String(error) }, 400);
    }
  }

  return json({ error: "Not Found" }, 404);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/")) {
      return handleApi(request, env);
    }

    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    return env.ASSETS.fetch(request);
  },
};
```

## `tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "moduleResolution": "Bundler",
    "strict": true,
    "skipLibCheck": true,
    "noEmit": true,
    "lib": [
      "ES2022",
      "WebWorker"
    ],
    "types": [
      "@cloudflare/workers-types"
    ]
  },
  "include": [
    "src/**/*.ts"
  ]
}
```

## `wrangler.jsonc`
```json
{
  "$schema": "./node_modules/wrangler/config-schema.json",
  "name": "werewolf-worker",
  "main": "src/index.ts",
  "compatibility_date": "2026-02-18",
  "compatibility_flags": ["nodejs_compat"],
  "assets": {
    "directory": "./public",
    "binding": "ASSETS",
    "not_found_handling": "single-page-application",
    "run_worker_first": ["/api/*"]
  },
  "vars": {
    "SILICONFLOW_MODEL": "deepseek-ai/DeepSeek-V3.2",
    "SILICONFLOW_BASE_URL": "https://api.siliconflow.cn/v1"
  }
}
```
