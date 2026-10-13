---
name: CHIP-8 Emulator
type: Personal
startYear: 2026
endYear: 2026
description: An emulator for the CHIP-8 virtual machine, written in C and playable in the terminal or in the browser through WebAssembly.
tech: [C, WebAssembly, Emscripten, JavaScript, HTML, CSS]
url: https://chip8.akandiah.ca
draft: true
---

## Overview

**CHIP-8** is a simple virtual machine from the late 1970s, designed so that games could be written once and run on the hobbyist computers of the time. This project is an emulator for it: it loads those games (ROMs) and runs them, either natively in a terminal or in the browser.

It was a short project to practise C and explore how a processor decodes its instructions, as a first step toward lower-level and embedded work. It was built with AI assistance, with every change reviewed by hand.

The emulator is split into a portable core and two thin frontends:

:::terms

- **Emulator Core**: The CHIP-8 machine itself (memory, registers, timers, display and keypad) and the cycle that executes its instructions.
- **Terminal Frontend**: Runs the core natively, drawing the display as text and reading the keyboard directly.
- **Browser Frontend**: Runs the same core compiled to WebAssembly, drawing to a canvas on a web page.

:::

### Emulator Core

The core holds the entire state of the machine, from its 4 KB of memory to its 64×32 monochrome display, and has no knowledge of where it's running. It executes one instruction at a time, and the frontend decides when. A frontend loads a ROM into memory, tells the core which keys are pressed, steps it forward, and draws the display whenever the core marks it as changed. That separation is what lets one implementation serve both frontends unchanged.

The machine runs on two clocks. The processor executes about 500 instructions per second, while its timers count down at 60 Hz, the rate games use to pace themselves. Keeping to both rates is the frontend's job.

### Instruction Decoding

Every CHIP-8 instruction is exactly two bytes, and its operands sit at fixed positions within those 16 bits: a register number, a second register, an 8-bit constant, or a 12-bit memory address. That makes decoding a matter of bitmasking, and each cycle follows the same sequence:

:::steps

1. **Fetch**: Read the two bytes at the program counter and combine them into one instruction.
2. **Extract**: Mask out every operand field up front, whichever ones the instruction ends up using.
3. **Advance**: Move the program counter past the instruction, so jumps and skips only need to adjust it further.
4. **Execute**: Dispatch on the top four bits to one of sixteen instruction families, with a second dispatch on the low bits for the families that share a prefix (such as arithmetic, keypad and timer instructions).

:::

Drawing is the most CHIP-8-specific instruction. Sprites are combined with the screen using XOR, so drawing a sprite twice erases it, and the machine reports whether any lit pixel was turned off. Games rely on that report for collision detection.

### Frontends

The terminal frontend draws each pixel as a pair of block characters and redraws the whole display in place, so it updates without scrolling. It reads key presses as they happen, without waiting for Enter, mapping a 4×4 block of the keyboard onto CHIP-8's 16-key hexadecimal keypad.

The browser frontend compiles the same core to WebAssembly with Emscripten. A web page can't pause between individual instructions the way a native program can, so it works in display frames instead: 60 times a second, it executes a batch of instructions and ticks the timers once. The page draws the display to a scaled canvas and offers a few bundled games, uploading a custom ROM, and pause and reset controls.
