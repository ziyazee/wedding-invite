# Google Places in Preview order

The Event locations section searches Places API (New) through the authenticated
`google-places` Edge Function. Opening Preview order automatically searches each
event's venue plus address when its Maps link is empty, whether details came from
a PDF/image or manual entry. The top Text Search match prefills the link and is
explicitly presented as a suggestion to verify, not a guaranteed correct match.
Name, address and a small map with a pin help users check it. Search suggestions,
manual links and **Find from venue details** remain available for corrections.
Existing links are never automatically overwritten, and editing/searching cancels
an in-flight automatic lookup. Clearing a link does not restart lookup within the
same visit. Failed automatic searches do not retry in a loop.

Main-event selection uses the existing main wedding map update. Venue names and
addresses entered in the details form are preserved. No database migration.

## Setup

1. In the Google Cloud project that owns `GOOGLE_API_KEY`, enable **Places API
   (New)**, **Maps Static API**, and billing. Allow both APIs in the key's API
   restrictions. This is a server-side
   web-service key; HTTP-referrer restrictions for browser keys will not work for
   Supabase Edge Function requests. Configure appropriate Google API quotas.
2. Set `GOOGLE_API_KEY` in the **Supabase project's Edge Function secrets**.
   A secret stored only in Vercel or a local frontend environment is not available
   to this function. Do not expose it through a `VITE_` variable.
   `GOOGLE_PROJECT_ID` may remain in secrets, but requests do not need it: the API
   key identifies its owning Google Cloud project.
3. Replace/redeploy the updated function to the same Supabase project used by the
   dashboard. The previous autocomplete/details-only version does not support
   automatic lookup or map images. In the dashboard editor, paste the entire
   current `supabase/functions/google-places/index.ts`, or deploy with:

   ```sh
   supabase functions deploy google-places
   ```

4. Release the frontend changes. No database migration is required.

The function validates the signed-in user and requires an existing company or
admin account. Google requests have an eight-second timeout. Manual search starts
after three characters and a 350 ms typing pause; stale frontend searches are
cancelled and ignored. Each field uses its own autocomplete session token, shared
with the selected place's Details request, then discarded. Automatic Text Search
and restoring an existing place do not reuse autocomplete session tokens.

Text Search and Details request only ID, display name, formatted address, and
coordinates. These display-name fields use Google's Pro SKUs. Map images use the
separately billable Maps Static API. Maps are fetched only as their cards approach
the visible area. A preview failure never discards the saved link or blocks
invitation creation. The small image opens the selected location in Google Maps;
it is not an interactive embedded map.

The `preview` action accepts bounded coordinates and returns PNG image bytes as a
data URL. It never returns the Google request URL/API key. Google image attribution
remains intact; the image is not cropped. No Google result or credential is logged
or cached server-side, and all function responses use `Cache-Control: no-store`.

The Google Maps attribution appears with suggestions and the preview card. Only
the selected Maps link is saved in invitation data, using `query_place_id` and a
short fallback from the user's own venue/address text. Google's names, addresses,
coordinates and map images stay transient and are not saved to drafts/orders or
copied into venue fields. The place ID in the link restores the exact map when
the preview is reopened. Opaque pasted short links retain an external verification
link; the app does not guess a different location or fetch arbitrary URLs to
expand redirects. Public invitation pages continue using their saved links and
do not load Places/Static Maps or a Maps iframe.

## Verification after deployment

- Sign into a normal or test company account and open Preview order.
- Import an invitation or enter venue/address manually: empty links should fill
  automatically and show a suggested location and matching map pin. Verify all
  event links independently, including the main wedding event.
- Reopen an order with existing links: links must not change. Links containing
  `query_place_id` should restore their exact place preview; opaque short links
  should offer external verification without showing a guessed map.
- Search a venue with its city, use arrow keys/Enter or tap to choose a result,
  and confirm the correct event's Maps link fills in.
- Confirm main-event selection updates the main wedding link as well.
- Search another event independently; clear or paste a link manually, including
  while a lookup is pending, and confirm late responses do not overwrite it.
- Save the invitation and check its Directions link. Creation should wait while
  a selected location is being resolved. Enter in search should never submit.
- Confirm search failure leaves manual Maps links usable.
- Scroll to additional event cards: map images should load near the viewport,
  retain attribution, and open their selected location when clicked.
- Disable Maps Static API temporarily in a test project: link lookup should still
  succeed and the form should offer external verification when images fail.

Implementation has not been built, browser-tested, deployed, or checked against
the live secrets/API.

References: [Autocomplete](https://developers.google.com/maps/documentation/places/web-service/place-autocomplete),
[Place Details](https://developers.google.com/maps/documentation/places/web-service/place-details),
[Text Search](https://developers.google.com/maps/documentation/places/web-service/text-search),
[Maps Static](https://developers.google.com/maps/documentation/maps-static/start),
[Maps URLs](https://developers.google.com/maps/documentation/urls/get-started),
[attribution](https://developers.google.com/maps/documentation/places/web-service/policies).
