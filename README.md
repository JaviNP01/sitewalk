# Site Walk for iPhone (home-screen app)

The Site Walk tool as an app you install from Safari. No Mac, Apple account or App Store
is needed. It runs full-screen from its own icon. Camera, video, audio notes, GPS, compass,
the 15 m sketch linking and on-phone storage all work, and it opens offline.

## 1. Put it on a free website (once, about 5 minutes, GitHub website only)

GitHub Pages hosts websites free from **public** repositories. Only the tool goes on the site;
your walks, photos and sketches never leave the phone unless you export them.

1. On github.com click **+ → New repository**. Name it `sitewalk`, choose **Public**, and click
   **Create repository**. Use a new repository, not the private Android one, because that one
   holds the app signing key.
2. Click **uploading an existing file**. Drag in **everything inside this folder**
   (`index.html`, `manifest.webmanifest`, `sw.js`, `README.md` and the `icons` folder), then
   click **Commit changes**.
3. Open **Settings → Pages**. Under *Build and deployment*, set **Source: Deploy from a branch**,
   **Branch: main**, folder **/ (root)**, and click **Save**.
4. After a minute or two the page shows your address, e.g.
   `https://javinp01.github.io/sitewalk/`.

## 2. Install it on the iPhone

1. Open that address in **Safari**. It must be Safari.
2. Tap **Share** (the square with the arrow) → **Add to Home Screen** → **Add**.
3. Open **Site Walk** from the new icon. Use it from the icon from now on: the home-screen app
   keeps its own storage, separate from Safari tabs.
4. The first time you start field mode or the camera, allow **Location**, **Motion & Orientation**
   (needed for the compass), **Camera** and **Microphone**.

If iOS keeps asking for location every time, go to **Settings → Privacy & Security →
Location Services → Safari Websites** and choose **While Using the App**.

## In the field

* **📷** photos and videos, **🎙** audio notes, **📝** text notes (type, or dictate with the keyboard
  microphone). Each one is pinned at your GPS position and linked to sketch points within 15 m.
* **↶ Undo** (top bar, side panel and camera screen) reverses the last action: a capture, a removal,
  a pin move, a comment edit, sketch drawing and editing, or loading a walk file. It goes back up to
  50 steps since the app was opened.

## Moving walks between the iPhone and the laptop

* **iPhone → laptop:** ☰ → **Export field pack (ZIP)** (or **Save site walk** for just the
  .html). The share sheet opens. Choose **Save to Files** (iCloud Drive / OneDrive / Google
  Drive), **Mail**, or a drive app. On the laptop, unzip into one folder and open the .html.
* **Laptop → iPhone (new sketches):** on the laptop click **Save site walk** and put the .html in
  iCloud Drive / OneDrive / Google Drive or email it. On the iPhone save it to Files, then
  ☰ → **Open saved walk**, pick it, and choose **Update the sketch, keep my photos**.

## Updating the tool

Replace `index.html` in the `sitewalk` repository with a newer version (upload it again and
commit). The app picks up the new version the next time it is opened with signal. Your walks
on the phone are kept.

## Good to know

* Walks are stored inside the home-screen app. **Deleting the app icon deletes the stored
  walks**, so export a field pack first.
* Map tiles need signal, but areas you've already looked at are kept for offline use.
  Road-name lookups need signal.
* Very large field packs (lots of long videos) are built in the phone's memory; if one fails,
  export more often.
* "Phone camera app" buttons use the iPhone Camera app for full-resolution shots. The in-app
  camera records GPS and compass heading at the moment of the shot.
