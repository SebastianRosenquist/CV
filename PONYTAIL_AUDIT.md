# Ponytail audit recommendations

- Remove the undocumented `blog` command; it only reports that no blog exists.
- Remove `status` and `industries` commands; their content is already available through `profile`.
- Remove terminal sounds, the mute control, and Web Audio setup.
- Remove the live UTC clock and `time` command.
- Replace rotating command suggestions with static `try: work` text while retaining Tab completion.

Estimated reduction: about 120 lines. No dependencies to remove.
