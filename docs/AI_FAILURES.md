# AI-assisted failures and corrections

## Public report claimed more than it did

The first browser flow changed local React state and then displayed “Received by server.” It did not call `/api/reports`. The submission audit identified the mismatch. The flow now posts to the demo API and labels shared persistence and external notification as unavailable.

## The documented journey link was stale

The README pointed to `/journey/demo-tw204`, while the public route resolves the trip code itself. The deployed page returned “Trip link not found.” The documented route now uses `/journey/TW204`.

## Runtime font downloads blocked reproducible builds

The application used `next/font/google`. A clean build failed when Google Fonts could not be reached. The submission version uses offline-safe system font stacks, so the production build no longer depends on a font download.

## Judge access stopped at authentication

Judge Mode linked to the protected staff dashboard without publishing judge credentials. The public evidence route now exposes a fictional, read-only case without weakening staff access controls.

## Dark theme reduced heading contrast

The Judge Mode heading used the dark `forest` token on a dark background. The audit changed the public heading to white and kept dark text only on light surfaces.
