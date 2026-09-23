# GDR2 → WBGDR2 Converter

Browser converter for Geometry Dash .gdr2 replays to the JSON .wbgdr2 macro format used by Web Dashers.

## Limitation

GDR2 stores input events and metadata. WBGDR2 stores a full state snapshot per frame (position, camera, speed and player state). Exact conversion therefore requires the same level/physics simulation. This first version converts the input timeline into a WBGDR2-shaped JSON timeline with deterministic default state values.

It is intended for format experimentation and will be improved once the Web Dashers playback/physics code is available.
