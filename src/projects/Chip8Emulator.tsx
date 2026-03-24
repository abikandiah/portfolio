import { CodeDisplay } from '@abumble/design-system/components/CodeDisplay'
import { UnorderedList } from '@abumble/design-system/components/List'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@abumble/design-system/components/Table'
import type { ProjectProps } from '@/types/ProjectTypes'
import { projectType } from '@/types/ProjectTypes'
import { techType } from '@/types/TechTypes'

export const chip8EmulatorProject: ProjectProps = {
	type: projectType.Personal,
	name: 'CHIP-8 Emulator',
	duration: '2024',
	url: 'https://chip8.akandiah.ca',
	description: `A fully-featured CHIP-8 virtual machine emulator written in C, deployable as both a native terminal application and a browser-based experience via WebAssembly.`,
	tech: [
		techType.C,
		techType.WebAssembly,
		techType.Emscripten,
		techType.HTML,
		techType.CSS,
		techType.JavaScript,
	],

	sections: [
		{ title: 'Overview', body: Overview },
		{ title: 'CHIP-8 Specification', body: Chip8Spec },
		{ title: 'System Architecture', body: SystemArchitecture },
		{ title: 'Core Emulator Design', body: CoreEmulatorDesign },
		{ title: 'Terminal Interface', body: TerminalInterface },
		{ title: 'WebAssembly Interface', body: WasmInterface },
		{ title: 'Web Frontend', body: WebFrontend },
		{ title: 'Build System', body: BuildSystem },
	],
}

function Overview() {
	return (
		<>
			<p>
				This is a software implementation of the CHIP-8 virtual machine — an
				interpreted platform originally designed in 1977 for early home
				microcomputers. It executes programs (ROMs) written for the CHIP-8
				platform, including classic games like Snake and Br8kout.
			</p>
			<p>
				The project is built around a{' '}
				<strong>shared core, multiple frontends</strong> pattern. The virtual
				machine — CPU, memory, display buffer, and keypad — is implemented once
				in portable C11 with no external dependencies, and adapted by two thin
				deployment layers:
			</p>
			<UnorderedList>
				<li>
					<strong>Terminal</strong> — Renders the display as UTF-8 block
					characters and reads keyboard input via raw <code>termios</code>,
					running natively on Linux.
				</li>
				<li>
					<strong>Browser</strong> — Compiled to WebAssembly via Emscripten,
					driving the CPU loop at 60 FPS and rendering to an HTML5 canvas.
					Playable in the browser with no installation.
				</li>
			</UnorderedList>
		</>
	)
}

function Chip8Spec() {
	return (
		<>
			<p>
				CHIP-8 is an interpreted programming language and virtual machine
				specification first published in 1977 by Joseph Weisbecker. It was
				designed to make game development easier for early microcomputers like
				the COSMAC VIP and Telmac 1800.
			</p>
			<p>
				Despite its age and simplicity, CHIP-8 remains a popular target for
				learning emulator development — it has a small, well-documented
				instruction set that is complex enough to be meaningful but small enough
				to implement in a weekend.
			</p>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Property</TableHead>
						<TableHead>Value</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{[
						['Memory', '4,096 bytes (4 KB)'],
						['Registers', '16 × 8-bit (V0–VF)'],
						['Display', '64 × 32 pixels, monochrome'],
						['Clock speed', '~500 Hz'],
						['Input', '16-key hexadecimal keypad'],
						['Sound', 'Single-tone buzzer'],
						['Stack depth', '16 levels'],
						['Instruction size', '2 bytes (fixed-width)'],
					].map(([property, value]) => (
						<TableRow key={property}>
							<TableCell className="whitespace-nowrap align-top font-medium">
								{property}
							</TableCell>
							<TableCell className="whitespace-normal">{value}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
			<p>
				CHIP-8 programs are stored as binary files (<code>.ch8</code> ROMs) and
				loaded starting at memory address <code>0x200</code>. The first 512
				bytes are reserved for the interpreter itself, including built-in font
				sprites for hexadecimal digits.
			</p>
		</>
	)
}

function SystemArchitecture() {
	return (
		<>
			<p>The five source files each own a distinct responsibility:</p>
			<UnorderedList>
				<li>
					<strong>chip8.c / chip8.h</strong> — the virtual machine. Pure logic
					with no platform dependencies.
				</li>
				<li>
					<strong>main.c</strong> — the entry point for the native build. Parses
					arguments, allocates the VM, and hands off to the terminal frontend.
				</li>
				<li>
					<strong>terminal.c</strong> — the POSIX/Linux frontend. Handles
					rendering to stdout and keyboard input via <code>termios</code>.
				</li>
				<li>
					<strong>wasm_frontend.c</strong> — the WebAssembly bridge. Exports C
					functions to JavaScript and runs the CPU loop via Emscripten's
					scheduler.
				</li>
				<li>
					<strong>web/index.html</strong> — the browser UI. JavaScript handles
					canvas rendering, input events, ROM loading, and UI controls.
				</li>
			</UnorderedList>
		</>
	)
}

function CoreEmulatorDesign() {
	return (
		<>
			<p>
				All virtual machine state lives in a single struct. The struct itself
				contains no internal heap allocations — every array is inline — so it
				can be allocated once and passed around by pointer with no further
				memory management.
			</p>
			<CodeDisplay
				code={`typedef struct {
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
} Chip8;`}
			/>

			<h3 className="sub-heading">Instruction Execution</h3>
			<p>
				Each call to <code>chip8_step()</code> performs one complete
				fetch-decode-execute cycle: read 2 bytes at <code>memory[pc]</code>,
				combine into a 16-bit opcode, advance <code>pc</code> by 2, then switch
				on the top nibble to dispatch. All 34 standard CHIP-8 instructions are implemented.
			</p>

			<h3 className="sub-heading">Sprite Rendering & Collision Detection</h3>
			<p>
				The <code>0xDXYN</code> opcode draws sprites using XOR logic — drawing
				the same sprite twice erases it, which games rely on for animation. Each
				drawn pixel is XOR'd with the display buffer; if a pixel was already on,
				the collision flag (<code>VF</code>) is set to 1.
			</p>

			<h3 className="sub-heading">Timing</h3>
			<p>The emulator runs at two distinct frequencies:</p>
			<UnorderedList>
				<li>
					<strong>CPU:</strong> 500 Hz — one instruction per 2,000 microseconds.
				</li>
				<li>
					<strong>Timers:</strong> 60 Hz — <code>delay_timer</code> and{' '}
					<code>sound_timer</code> decrement once per frame.
				</li>
			</UnorderedList>
			<p>
				In the terminal, precise timing is achieved with <code>nanosleep()</code>.
				In the browser, Emscripten's <code>emscripten_set_main_loop()</code>{' '}
				fires at 60 FPS, and the CPU executes ~8 instructions per frame to
				maintain the correct frequency ratio.
			</p>
		</>
	)
}

function TerminalInterface() {
	return (
		<>
			<p>
				The terminal interface renders the 64×32 display using UTF-8 block
				characters directly in the terminal window, with real-time keyboard
				input.
			</p>
			<h3 className="sub-heading">Rendering</h3>
			<p>
				Each pixel is rendered as a pair of full-block characters — ON pixels
				use <code>██</code> and OFF pixels use two spaces. The cursor is
				repositioned to the top-left with an ANSI escape before each frame, so
				the display updates in-place without flickering or scrolling.
			</p>
			<h3 className="sub-heading">Input</h3>
			<p>
				The terminal is put into <strong>raw mode</strong> via POSIX{' '}
				<code>termios</code>: line buffering is disabled, echo is disabled, and
				reads are non-blocking. Keyboard keys map to the 16-key CHIP-8
				hexadecimal keypad:
			</p>
			<CodeDisplay
				code={`Keyboard  →  CHIP-8 Keypad
─────────────────────────────
1 2 3 4   →  1 2 3 C
Q W E R   →  4 5 6 D
A S D F   →  7 8 9 E
Z X C V   →  A 0 B F`}
			/>
		</>
	)
}

function WasmInterface() {
	return (
		<>
			<p>
				The WASM frontend is a thin bridge layer that exports C functions to
				JavaScript and drives the emulator using Emscripten's main loop
				mechanism. These functions are callable from JavaScript as{' '}
				<code>Module._functionName()</code>:
			</p>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Function</TableHead>
						<TableHead>Purpose</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{[
						['wasm_get_rom_buffer()', 'Returns a pointer to the ROM staging buffer in WASM memory'],
						['wasm_load_rom_from_buffer(size)', 'Loads ROM from the staging buffer, resets VM'],
						['wasm_reset_rom()', 'Re-initializes the VM and reloads the current ROM'],
						['wasm_set_paused(p)', 'Pauses or resumes the Emscripten main loop'],
						['wasm_set_key(key, value)', 'Sets the state of a keypad key (1=pressed, 0=released)'],
						['wasm_get_display()', 'Returns a pointer to the display pixel buffer in WASM memory'],
					].map(([fn, purpose]) => (
						<TableRow key={fn}>
							<TableCell className="whitespace-nowrap align-top font-medium">
								<code>{fn}</code>
							</TableCell>
							<TableCell className="whitespace-normal">{purpose}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>

			<h3 className="sub-heading">Memory Sharing — The Staging Buffer Pattern</h3>
			<p>
				A key challenge with WASM is safely sharing data between C and
				JavaScript. When <code>ALLOW_MEMORY_GROWTH=1</code> is enabled (required
				for ROM loading), the WASM memory buffer can be reallocated, invalidating
				any JavaScript references to raw pointers.
			</p>
			<p>
				The solution is a <strong>static staging buffer</strong> in C. JavaScript
				writes ROM bytes into the buffer <em>before</em> calling any function
				that could trigger memory growth, making the approach safe regardless of
				the WASM memory layout.
			</p>
			<CodeDisplay
				code={`static uint8_t rom_staging[CHIP8_MEMORY_SIZE - PC_START_ADDRESS];  // 3,584 bytes

uint8_t* wasm_get_rom_buffer(void) {
    return rom_staging;
}

int wasm_load_rom_from_buffer(int size) {
    // Copy from staging buffer → chip8.memory[0x200]
    memcpy(&chip->memory[PC_START_ADDRESS], rom_staging, size);
    return 0;
}`}
			/>
		</>
	)
}

function WebFrontend() {
	return (
		<>
			<p>
				The browser UI is a single self-contained HTML file with no external
				dependencies beyond the Emscripten-generated JS loader. It includes:
			</p>
			<UnorderedList>
				<li>
					<strong>Canvas</strong> — 64×32 display scaled up to fit the viewport
					(max 640px wide), using <code>image-rendering: pixelated</code> for
					crisp scaling.
				</li>
				<li>
					<strong>ROM Selector</strong> — dropdown to pick one of 3 bundled ROMs
					(Snake, Rock Paper Scissors, Br8kout).
				</li>
				<li>
					<strong>File Upload</strong> — allows loading any custom{' '}
					<code>.ch8</code> ROM from the user's machine.
				</li>
				<li>
					<strong>Controls</strong> — Reset and Pause/Resume buttons.
				</li>
				<li>
					<strong>Key Map Reference</strong> — visual display of the
					keyboard-to-keypad mapping.
				</li>
			</UnorderedList>
			<p>
				The display pointer is read directly from WASM linear memory via{' '}
				<code>HEAPU32</code>, then converted pixel-by-pixel into an{' '}
				<code>ImageData</code> object and stamped onto the canvas with{' '}
				<code>putImageData</code>. This reads the pixel buffer straight out of
				WASM's address space without an intermediate JavaScript array allocation.
			</p>
			<CodeDisplay
				code={`function renderFrame() {
    const ptr = Module._wasm_get_display();
    const display = new Uint32Array(Module.HEAPU32.buffer, ptr, 64 * 32);

    const imageData = ctx.createImageData(64, 32);
    for (let i = 0; i < 64 * 32; i++) {
        const on = display[i] ? 255 : 0;
        imageData.data[i * 4 + 0] = on;  // R
        imageData.data[i * 4 + 1] = on;  // G
        imageData.data[i * 4 + 2] = on;  // B
        imageData.data[i * 4 + 3] = 255; // A
    }
    ctx.putImageData(imageData, 0, 0);
}`}
			/>
		</>
	)
}

function BuildSystem() {
	return (
		<>
			<p>The Makefile provides two build targets:</p>
			<h3 className="sub-heading">Native Binary</h3>
			<CodeDisplay
				code={`# Compile with GCC
make
# Produces: ./chip8 (Linux executable)

# Run a ROM
./chip8 roms/snake.ch8`}
			/>
			<h3 className="sub-heading">WebAssembly</h3>
			<CodeDisplay
				code={`# Compile with Emscripten
make wasm
# Produces: web/chip8.js, web/chip8.wasm (~14 KB)`}
			/>
			<p>
				WebAssembly requires specific HTTP headers to run in a secure browser
				context. The deployment includes a <code>_headers</code> file that
				configures <code>Cross-Origin-Opener-Policy</code> and{' '}
				<code>Cross-Origin-Embedder-Policy</code> for static hosting.
			</p>
		</>
	)
}
