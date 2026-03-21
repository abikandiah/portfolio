# CHIP-8 Emulator — Architecture Overview

> A fully-featured CHIP-8 virtual machine emulator written in C, deployable as both a native terminal application and a browser-based experience via WebAssembly.

---

## Table of Contents

1. [What Is This Project?](#1-what-is-this-project)
2. [Goals & Motivation](#2-goals--motivation)
3. [What I Learned](#3-what-i-learned)
4. [What Is CHIP-8?](#4-what-is-chip-8)
5. [System Architecture](#5-system-architecture)
6. [Project Layout](#6-project-layout)
7. [Core Emulator Design](#7-core-emulator-design)
8. [Terminal Interface](#8-terminal-interface)
9. [WebAssembly (WASM) Interface](#9-webassembly-wasm-interface)
10. [Web Frontend](#10-web-frontend)
11. [Build System](#11-build-system)
12. [ROM Support](#12-rom-support)
13. [Key Design Decisions](#13-key-design-decisions)
14. [Technical Specifications](#14-technical-specifications)

---

## 1. What Is This Project?

This is a **CHIP-8 emulator** — a software implementation of a virtual machine originally designed in the 1970s for early home microcomputers. The emulator faithfully executes programs (ROMs) written for the CHIP-8 platform, including classic games like Snake and Breakout.

What makes this project unique is its **dual-deployment architecture**: the same core emulator logic runs both in a Linux terminal and directly in a web browser, with the browser version compiled to WebAssembly. This means anyone can play CHIP-8 games without installing anything — just visit the web page.

**For non-technical readers:** Think of it like building a small virtual computer inside your real computer (or browser). The emulator reads the instructions from old game files and executes them, making old games playable on modern machines.

**For technical readers:** The core VM is written in portable C11, targeting both native compilation (GCC/Clang) and WebAssembly via Emscripten. The display, input, and timing layers are cleanly separated from the CPU core, enabling the same `chip8.c` to power two completely different frontends.

---

## 2. Goals & Motivation

The primary goals of this project were:

- **Learn emulator development fundamentals** — fetch-decode-execute cycles, memory mapping, timing control, and hardware-level abstractions.
- **Explore WebAssembly as a deployment target** — compile a C codebase to WASM and integrate it with a JavaScript/HTML5 frontend, without rewriting the core logic.
- **Build a portable, dependency-free system** — the entire emulator uses only the C standard library and POSIX APIs. No third-party libraries.
- **Produce something playable** — ship a real product with multiple bundled games and a polished browser UI.

---

## 3. What I Learned

### Systems Programming
- How CPUs work at the instruction level — opcodes, registers, the program counter, the call stack, and how each instruction mutates machine state.
- Precise timing using nanosecond-resolution clocks (`clock_gettime`) to synchronize a 500 Hz CPU with a 60 Hz display refresh.
- Terminal I/O at the raw level using POSIX `termios` — disabling line-buffering, disabling echo, and reading single keypresses non-blocking.

### WebAssembly & Cross-Platform Compilation
- How Emscripten compiles C into `.wasm` binary modules and generates a JavaScript loader (`chip8.js`).
- How to safely share memory between C and JavaScript using Emscripten's `HEAPU8` / `HEAPU32` typed array views.
- CORS requirements for WASM in secure browser contexts (`Cross-Origin-Embedder-Policy`, `Cross-Origin-Opener-Policy`).
- The challenge of memory growth in WASM — why a static staging buffer is more robust than passing raw pointers across the boundary.

### Emulator Architecture
- The CHIP-8 instruction set — all 35 opcodes, including arithmetic, control flow, sprite rendering with XOR collision detection, and BCD encoding.
- How display rendering optimizations (a `draw_flag`) reduce redundant work.
- How keypad state differs from keyboard events — CHIP-8 expects a polled keypad (is key X currently held?), not a keyboard event stream.

---

## 4. What Is CHIP-8?

CHIP-8 is an interpreted programming language and virtual machine specification first published in 1977 by Joseph Weisbecker. It was designed to make game development easier for early microcomputers like the COSMAC VIP and Telmac 1800.

### Specifications (original hardware)
| Property | Value |
|----------|-------|
| Memory | 4,096 bytes (4 KB) |
| Registers | 16 × 8-bit (V0–VF) |
| Display | 64 × 32 pixels, monochrome |
| Clock speed | ~500 Hz (varies by implementation) |
| Input | 16-key hexadecimal keypad |
| Sound | Single-tone buzzer |
| Stack depth | 16 levels |
| Instruction size | 2 bytes (fixed-width) |

CHIP-8 programs are stored as binary files (`.ch8` ROMs) and loaded starting at memory address `0x200`. The first 512 bytes (`0x000–0x1FF`) are reserved for the interpreter itself, including built-in font sprites for hexadecimal digits.

Despite its age and simplicity, CHIP-8 remains a popular target for learning emulator development — it has a small, well-documented instruction set that is complex enough to be meaningful but small enough to implement in a weekend.

---

## 5. System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                        ROM File (.ch8)                   │
└───────────────────────────┬─────────────────────────────┘
                            │ load
                            ▼
┌─────────────────────────────────────────────────────────┐
│                   Core Emulator (chip8.c)                │
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐ │
│  │  Memory  │  │Registers │  │  Stack   │  │Timers  │ │
│  │  4096 B  │  │  V0–VF   │  │ 16-deep  │  │ 60 Hz  │ │
│  └──────────┘  └──────────┘  └──────────┘  └────────┘ │
│                                                         │
│  ┌──────────────────────┐  ┌──────────────────────────┐ │
│  │  Display Buffer      │  │  Keypad State            │ │
│  │  64×32 px (uint32)   │  │  16 keys (uint8 array)   │ │
│  └──────────────────────┘  └──────────────────────────┘ │
│                                                         │
│              chip8_step()  — fetch/decode/execute        │
└──────────────┬──────────────────────────┬───────────────┘
               │                          │
       ┌───────▼──────┐          ┌────────▼──────────┐
       │  Terminal UI  │          │  WASM Frontend    │
       │  (terminal.c) │          │ (wasm_frontend.c) │
       │               │          │                   │
       │ - raw termios │          │ - Emscripten loop │
       │ - ANSI render │          │ - JS memory bridge│
       │ - nanosleep   │          │ - EM_ASM callbacks│
       └───────┬───────┘          └────────┬──────────┘
               │                           │
       ┌───────▼───────┐          ┌────────▼──────────┐
       │ Linux Terminal │          │  Web Browser      │
       │                │          │                   │
       │ UTF-8 blocks   │          │ HTML5 Canvas      │
       │ Keyboard I/O   │          │ JavaScript UI     │
       └───────────────┘          └───────────────────┘
```

The architecture follows a **shared core, multiple frontends** pattern:

- `chip8.c` / `chip8.h` — the virtual machine. Pure logic with no platform dependencies.
- `terminal.c` — the POSIX/Linux frontend. Handles rendering to stdout and keyboard input via `termios`.
- `wasm_frontend.c` — the WebAssembly bridge. Exports C functions to JavaScript, runs the CPU loop via Emscripten's scheduler.
- `web/index.html` — the browser UI. JavaScript handles canvas rendering, input events, ROM loading, and UI controls.

---

## 6. Project Layout

```
chip8-emulator/
│
├── src/
│   ├── chip8.h             # VM struct definition and public API
│   ├── chip8.c             # Full CPU/VM implementation (423 lines)
│   ├── main.c              # Terminal entry point (35 lines)
│   ├── terminal.c          # Terminal rendering & input loop (167 lines)
│   ├── terminal.h          # Terminal API header
│   └── wasm_frontend.c     # WASM-exported functions (80 lines)
│
├── web/
│   ├── index.html          # Browser UI (HTML/CSS/JS, 275 lines)
│   ├── chip8.js            # Emscripten-generated JS runtime loader
│   ├── chip8.wasm          # Compiled WebAssembly binary (~14 KB)
│   ├── _headers            # CORS headers for static hosting
│   └── roms/               # Bundled ROM files
│       ├── snake.ch8
│       ├── RPS.ch8
│       └── br8kout.ch8
│
├── roms/                   # Source ROMs for terminal use
│   ├── snake.ch8
│   ├── RPS.ch8
│   └── br8kout.ch8
│
├── Makefile                # Build system (native + WASM targets)
├── chip8                   # Compiled native binary
└── LICENSE                 # MIT License
```

**Lines of code:** ~742 lines of C total, plus ~275 lines of HTML/CSS/JavaScript for the web frontend. The project is intentionally compact — no bloat, no dependencies beyond the C standard library.

---

## 7. Core Emulator Design

### The Chip8 Struct

All virtual machine state lives in a single struct:

```c
typedef struct {
  uint8_t  memory[4096];       // 4 KB address space
  uint8_t  registers[16];      // V0–VF general-purpose registers
  uint16_t index;              // Index register (memory addressing)
  uint16_t pc;                 // Program counter
  uint16_t stack[16];          // Call stack (16 subroutine levels)
  uint8_t  sp;                 // Stack pointer
  uint8_t  delay_timer;        // Countdown timer at 60 Hz
  uint8_t  sound_timer;        // Buzzer timer at 60 Hz
  uint8_t  keypad[16];         // Current keypad state (1=pressed)
  uint32_t display[64 * 32];   // Pixel buffer (1=on, 0=off)
  bool     draw_flag;          // Dirty bit: display needs redraw
} Chip8;
```

No heap allocation. The entire VM state is 4,096 + overhead bytes, fitting comfortably on the stack.

### Memory Layout

```
0x000 ┌──────────────────┐
      │  Interpreter /   │
      │  Font data       │  ← 16 hex digit sprites (5 bytes each)
0x050 └──────────────────┘
      │  Reserved        │
0x200 ├──────────────────┤
      │                  │
      │  Program space   │  ← ROMs loaded here (up to 3,840 bytes)
      │  (ROM data)      │
0xFFF └──────────────────┘
```

### Instruction Execution — chip8_step()

Each call to `chip8_step()` performs one complete fetch-decode-execute cycle:

1. **Fetch** — read 2 bytes at `memory[pc]` and `memory[pc+1]`, combine into a 16-bit opcode.
2. **Increment** — advance `pc` by 2.
3. **Decode & Execute** — switch on the top nibble (bits 15–12) of the opcode, then on sub-nibbles as needed.

All 35 CHIP-8 opcodes are implemented, grouped by their leading nibble:

| Opcode Group | Operations |
|---|---|
| `0x0___` | Clear display (`00E0`), return from subroutine (`00EE`) |
| `0x1NNN` | Jump to address NNN |
| `0x2NNN` | Call subroutine at NNN (push PC to stack) |
| `0x3–4XKK` | Skip next instruction if Vx equals / does not equal KK |
| `0x5–9XY_` | Skip instructions based on register comparisons |
| `0x6–7XKK` | Set register / add immediate value |
| `0x8XY_` | Register-to-register: OR, AND, XOR, ADD, SUB, SHR, SHL |
| `0xANNN` | Set index register to NNN |
| `0xBNNN` | Jump to NNN + V0 |
| `0xCXKK` | Set Vx = random byte AND KK |
| `0xDXYN` | Draw N-byte sprite at (Vx, Vy), set VF on collision |
| `0xEX__` | Skip based on key state |
| `0xFX__` | Timer read/write, BCD, font address, memory store/load |

### Sprite Rendering & Collision Detection

The `0xDXYN` opcode is the most complex — it draws a sprite and handles collision:

```
For each row (0 to N-1):
  byte = memory[index + row]
  For each bit (0 to 7):
    if bit is set:
      pixel_x = (Vx + col) % 64   ← wraps at display edge
      pixel_y = (Vy + row) % 32
      if display[pixel_y * 64 + pixel_x] is already ON:
        VF = 1                     ← collision detected
      display[pixel_y * 64 + pixel_x] ^= 1  ← XOR toggle
```

XOR rendering means drawing the same sprite twice erases it — a key property games rely on for animation.

### Timing

The emulator runs at two distinct frequencies:
- **CPU:** 500 Hz — one instruction per 2,000 microseconds
- **Timers:** 60 Hz — `delay_timer` and `sound_timer` decrement once per frame

In the terminal, precise timing is achieved with `nanosleep()`. In the browser, Emscripten's `emscripten_set_main_loop()` fires at 60 FPS, and the CPU executes `500 / 60 ≈ 8` instructions per frame to maintain the correct frequency ratio.

---

## 8. Terminal Interface

**File:** `src/terminal.c` (167 lines)

The terminal interface renders the 64×32 display using UTF-8 block characters directly in the terminal window, with real-time keyboard input.

### Rendering

Each pixel is rendered as a pair of full-block characters:
- **Pixel ON:** `██` (UTF-8 `\u2588`, rendered in the terminal foreground color)
- **Pixel OFF:** `  ` (two spaces)

The cursor is repositioned to the top-left using the ANSI escape `\033[H` before each frame, so the display appears to update in-place without flickering or scrolling.

### Input

The terminal is put into **raw mode** via POSIX `termios`:
- Line buffering is disabled (input is available one byte at a time)
- Character echo is disabled
- Reads are non-blocking (returns immediately if no key is pressed)

Keyboard keys are mapped to the 16-key CHIP-8 hexadecimal keypad:

```
Keyboard  →  CHIP-8 Keypad
─────────────────────────────
1 2 3 4   →  1 2 3 C
Q W E R   →  4 5 6 D
A S D F   →  7 8 9 E
Z X C V   →  A 0 B F
```

`ESC` or `Ctrl+C` exits the emulator and restores the terminal to its original state.

### Main Loop

```
loop:
  read keyboard → update keypad state
  chip8_step()  → execute one CPU instruction
  every 8 iterations:
    chip8_decrement_timers()
    clear keypad
  if draw_flag:
    render_terminal()
  nanosleep(2000 µs)
```

---

## 9. WebAssembly (WASM) Interface

**File:** `src/wasm_frontend.c` (80 lines)

The WASM frontend is a thin bridge layer that exports C functions to JavaScript and drives the emulator using Emscripten's main loop mechanism.

### Exported Functions

These functions are callable from JavaScript as `Module._functionName()`:

| C Function | JavaScript Purpose |
|---|---|
| `wasm_get_rom_buffer()` | Returns a pointer to the ROM staging buffer in WASM memory |
| `wasm_load_rom_from_buffer(size)` | Loads ROM from the staging buffer, resets VM |
| `wasm_reset_rom()` | Re-initializes the VM and reloads the current ROM |
| `wasm_set_paused(p)` | Pauses or resumes the Emscripten main loop |
| `wasm_set_key(key, value)` | Sets the state of a keypad key (1=pressed, 0=released) |
| `wasm_get_display()` | Returns a pointer to the display pixel buffer in WASM memory |

### Main Loop

```
wasm_main()
  └─ chip8_init()
  └─ emscripten_set_main_loop(wasm_frame, 60, 1)
       └─ wasm_frame()  [called 60× per second]
            ├─ for i in 0..(CPU_FREQ/60):
            │    chip8_step()
            ├─ chip8_decrement_timers()
            └─ if draw_flag:
                 EM_ASM(renderFrame())   ← calls JS function
```

### Memory Sharing — The Staging Buffer Pattern

A key challenge with WASM is safely sharing data between C and JavaScript. When `ALLOW_MEMORY_GROWTH=1` is enabled (required for ROM loading), the WASM memory buffer can be reallocated by the runtime, invalidating any JavaScript references to raw pointers.

The solution used here is a **static staging buffer**:

```c
// In wasm_frontend.c
static uint8_t rom_staging_buffer[3584];  // max ROM size

int* wasm_get_rom_buffer() {
    return (int*)rom_staging_buffer;
}

void wasm_load_rom_from_buffer(int size) {
    // Copy from staging buffer → chip8.memory[0x200]
    memcpy(&chip.memory[PC_START_ADDRESS], rom_staging_buffer, size);
}
```

JavaScript writes ROM bytes into the staging buffer *before* calling any function that could trigger memory growth, making the approach safe regardless of the WASM memory layout.

### CORS Headers for WASM

WebAssembly requires specific HTTP headers to run in a secure context. The `web/_headers` file configures these for static hosting:

```
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

These headers enable `SharedArrayBuffer` access and allow the browser to load the `.wasm` binary in a restricted security context.

---

## 10. Web Frontend

**File:** `web/index.html` (275 lines of combined HTML, CSS, and JavaScript)

The browser UI is a single self-contained HTML file with no external dependencies (beyond the Emscripten-generated JS loader).

### UI Components

- **Canvas** — 64×32 display scaled up to fit the viewport (max 640px wide), using `image-rendering: pixelated` for crisp scaling.
- **ROM Selector** — dropdown to pick one of 3 bundled ROMs.
- **File Upload** — allows loading any custom `.ch8` ROM from the user's machine.
- **Controls** — Reset and Pause/Resume buttons.
- **Status Bar** — displays current ROM name and running/paused state.
- **Key Map Reference** — visual display of the keyboard-to-keypad mapping.

### Frame Rendering

```javascript
function renderFrame() {
    const ptr = Module._wasm_get_display();
    const pixels = new Uint32Array(Module.HEAPU32.buffer, ptr, 64 * 32);

    const imageData = ctx.createImageData(64, 32);
    for (let i = 0; i < 64 * 32; i++) {
        const on = pixels[i] !== 0;
        imageData.data[i * 4 + 0] = on ? 255 : 0;  // R
        imageData.data[i * 4 + 1] = on ? 255 : 0;  // G
        imageData.data[i * 4 + 2] = on ? 255 : 0;  // B
        imageData.data[i * 4 + 3] = 255;            // A
    }
    ctx.putImageData(imageData, 0, 0);
}
```

The display pointer is read directly from WASM linear memory via `HEAPU32`, converted to an `ImageData` object, and stamped onto the canvas with `putImageData`. This avoids any data copying between C and JavaScript — the canvas reads directly from the WASM memory space.

### Input Handling

```javascript
document.addEventListener('keydown', (e) => {
    const key = keyMap[e.key];
    if (key !== undefined) Module._wasm_set_key(key, 1);
});
document.addEventListener('keyup', (e) => {
    const key = keyMap[e.key];
    if (key !== undefined) Module._wasm_set_key(key, 0);
});
```

Key events set and clear individual bits in the CHIP-8 keypad state array. The emulator reads this state synchronously during instruction execution — CHIP-8 uses polled input, not event-driven input.

### ROM Loading Pipeline

```
User selects ROM from dropdown
  │
  ▼
fetch('/roms/snake.ch8')
  │
  ▼
ArrayBuffer → Uint8Array
  │
  ▼
Module.HEAPU8.set(bytes, Module._wasm_get_rom_buffer())
  │
  ▼
Module._wasm_load_rom_from_buffer(bytes.length)
  │
  ▼
Emulator resets and begins executing new ROM
```

Custom ROM uploads follow the same pipeline but use the `FileReader` API to load the file into an `ArrayBuffer` first.

---

## 11. Build System

**File:** `Makefile`

Two build targets:

### Native Binary

```bash
make
# Produces: ./chip8 (Linux/macOS executable)
```

Compiles with GCC:
```
gcc -std=c11 -O2 -Wall -Wextra -I src \
    src/main.c src/chip8.c src/terminal.c \
    -o chip8
```

Run a ROM:
```bash
./chip8 roms/snake.ch8
```

### WebAssembly

```bash
make wasm
# Produces: web/chip8.js, web/chip8.wasm
```

Compiles with Emscripten:
```
emcc -std=c11 -O2 -I src \
    src/chip8.c src/wasm_frontend.c \
    -s WASM=1 \
    -s EXPORTED_FUNCTIONS=[_wasm_main, _wasm_set_key, ...] \
    -s EXPORTED_RUNTIME_METHODS=[HEAPU8, HEAPU32] \
    -s ALLOW_MEMORY_GROWTH=1 \
    -o web/chip8.js
```

Also copies ROM files from `roms/` → `web/roms/`.

### Cleanup

```bash
make clean
# Removes object files, binary, and WASM output
```

---

## 12. ROM Support

CHIP-8 ROMs are binary files (typically `.ch8`) that encode programs as sequences of 2-byte CHIP-8 instructions. ROMs are loaded into memory starting at address `0x200`, which is the conventional CHIP-8 program start address.

### Bundled ROMs

| ROM | Size | Description |
|---|---|---|
| `snake.ch8` | ~1.4 KB | Classic snake game |
| `RPS.ch8` | ~2.0 KB | Rock Paper Scissors |
| `br8kout.ch8` | ~200 B | Breakout / Arkanoid clone |

### Custom ROMs

The terminal version accepts any `.ch8` file as a command-line argument. The web version has a file upload button. ROMs must not exceed 3,584 bytes (the program space from `0x200` to `0xFFF`).

---

## 13. Key Design Decisions

### 1. Shared Core, Multiple Frontends
Rather than writing separate emulators for terminal and web, the CPU, memory, display buffer, and keypad are implemented once in `chip8.c`. Both `terminal.c` and `wasm_frontend.c` are thin adapters on top of the same core. This keeps the total codebase under 750 lines while supporting two completely different deployment targets.

### 2. No External Dependencies
The emulator uses only the C standard library (`stdint.h`, `stdbool.h`, `stdio.h`, `stdlib.h`, `string.h`, `time.h`) and POSIX APIs (`termios`, `unistd.h`, `fcntl.h`). This means zero installation overhead, trivial cross-compilation, and no supply-chain risk.

### 3. Static Staging Buffer for WASM
Emscripten's `ALLOW_MEMORY_GROWTH` flag means the WASM heap can be reallocated, which would invalidate any JavaScript `TypedArray` views previously pointing into it. Instead of managing this on the JavaScript side, a static `rom_staging_buffer` in C is used as a stable write target — JavaScript writes there first, then calls a C function to copy data into the VM, by which point no memory growth can occur mid-operation.

### 4. draw_flag Optimization
The display buffer is only flushed to the screen (or canvas) when a sprite draw instruction (`0xD___`) actually executes. This avoids redundant renders on the majority of CPU cycles where the display has not changed — important for maintaining CPU performance in the terminal.

### 5. Fixed-Width Instructions
All CHIP-8 opcodes are exactly 2 bytes. This simplifies the fetch step to two memory reads and a bitwise combine, with no variable-length decoding needed. The program counter always advances by 2.

---

## 14. Technical Specifications

| Specification | Value |
|---|---|
| Language | C (C11 standard) |
| Compiler (native) | GCC / Clang |
| Compiler (WASM) | Emscripten (`emcc`) |
| CPU frequency | 500 Hz |
| Timer frequency | 60 Hz |
| Display resolution | 64 × 32 pixels, monochrome |
| Memory | 4,096 bytes |
| Registers | 16 × 8-bit (V0–VF) |
| Stack depth | 16 levels |
| Keypad | 16 keys (0–F hexadecimal) |
| Opcodes implemented | 35 (complete CHIP-8 set) |
| WASM binary size | ~14 KB |
| Total source lines | ~742 C + ~275 HTML/JS/CSS |
| External dependencies | None |
| License | MIT |
