# CHIP-8 Emulator: brief

Questionnaire answers for the write-up. Ignored by the build.

Source: https://github.com/abikandiah/chip8-emulator

## Part 1

1. **Work or Personal?** Personal.
2. **When?** 2026, finished. The commit history runs from 2026-03-18 to 2026-03-25 (about a week).
3. **Problem / why?** "A fun project for some practice in C and low level environments. To explore processor instruction decoding design. Starting the move to lower-level languages and embedded."
4. **Role?** Solo. No meta row.
5. **Most proud of?** "It was a pretty straightforward project, I wouldn't say proud of anything other than that it was a neat project and fun to build an emulator in C ... It's cool that it's hosted as a frontend WASM page, but this was an AI-assisted project, so it wasn't a struggle or effort to build. The coolest part of it for me was coding up the emulator instruction decoding logic, the bitmasking etc., and getting back to C and the lower level."
6. **Numbers?** None of the author's own. Spec facts are fine (instruction count, 500 Hz CPU, 60 Hz timers, 64×32 display).
7. **Live link?** https://chip8.akandiah.ca
8. **Write-up, case study, or both?** Write-up only, and brief. Case study skipped for now.
9. **Anything to leave out?** Nothing.
10. **Related projects?** None.

## Part 2

1. **Instruction decoding design (switch on the top nibble, nested switches, operands extracted up front): weighed alternatives?** "No, it was the natural choice to be fair, I was guided toward it, this project wasn't a solo endeavour, it was AI-assisted so I was guided in a way. We could add something mentioning AI-assisted development. It wasn't fully AI-coded by an agent, but I got help from AI to build it and I reviewed everything."
2. **ROM staging buffer for WASM memory growth: a bug hit, or a precaution?** "Same as before, AI coding, maybe we should tone it down a bit since it was AI assisted and not as personal, more like a quick AI project."
3. **README lists a single-tone buzzer, but no audio plays: claim sound?** "Ignore that, that looks like a mistake." Don't mention sound.
4. **Case study material?** Skipped for now.

## Direction

- Keep the page short and modest: a quick, AI-assisted learning project, not a showcase.
- Say plainly that it was built with AI assistance, with every change reviewed by the author.
- The decoding (fetch, bitmask the operand fields, dispatch on the top nibble) is the part the author enjoyed most and is the page's centre.
- The staging buffer and other WASM details stay a light mention at most.
