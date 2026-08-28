# Animation TODO

::neup.documentation::animation-todo
::title Animation TODO

::private

Implementation checklist for the reusable animated icon components in this
folder.

::private end

::end

## Shared animation rules

- [x] Replace filled background circles with outline-only circles wherever an
      animation uses a circle.
- [x] Make the outline revolve continuously around the icon while the icon's
      own motion continues.
- [x] Keep the icon and its revolving outline in the same semantic color:
      grey for neutral actions, green for success, red for failure, blue for
      active/in-progress actions, and orange for warnings/stopping states.
- [x] Preserve accessible labels, `label={null}` decorative behavior, custom
      sizing, pause support where applicable, and reduced-motion behavior.
- [x] Verify that the current animation files are registered in
      `.neup/components/ui/icon.tsx` so they can be used through the named
      animation API.
- [x] Register each newly created animation in `.neup/components/ui/icon.tsx`
      as the remaining animation files are added.

## Existing animations to revise

- [x] `Download.tsx`: add a grey revolving outline circle around the grey
      download icon.
- [x] `Upload.tsx`: add a grey revolving outline circle around the grey upload
      icon.
- [x] `TickMark.tsx`: replace the filled green circle with a green revolving
      outline circle and retain the green tick animation.
- [x] `CrossMark.tsx`: replace the filled red circle with a red revolving
      outline circle and retain the red cross animation.
- [x] `CodeRevolve.tsx`: use a grey revolving outline circle and grey code icon.

## Core action animations

- [x] `Play.tsx`: blue play icon with a blue revolving outline circle.
- [x] `Stop.tsx`: orange stop icon with an orange revolving outline circle.

## Additional animations

- [x] `Bell.tsx`: grey bell icon with a grey revolving outline circle for
      notifications.
- [x] `Copy.tsx`: grey overlapping-copy icon styled like common word
      processing applications.
- [x] `Save.tsx`: grey floppy-disk save icon.
- [x] `Send.tsx`: grey send/paper-plane icon.
- [x] `Pending.tsx`: grey clock icon with a grey revolving outline circle.
- [x] `Warning.tsx`: orange warning triangle icon with an orange revolving
      outline circle.
- [x] `Loading.tsx`: blue spinning outline only, without a separate icon.
- [x] `Info.tsx`: blue information icon with a blue spinning/revolving outline.
- [x] `Deploy.tsx`: blue rocket icon with a blue revolving outline circle and
      an intended transition to `TickMark` on success.
- [x] `Trash.tsx`: red trash icon with a red revolving outline circle.
- [x] `CreateFile.tsx`: blue file-with-plus icon with a blue revolving outline
      circle.
- [x] `Connecting.tsx`: neutral link icon with a revolving outline circle.
- [x] `Disconnected.tsx`: orange link-plus-ban icon with an orange revolving
      outline circle.
- [x] `CloudSync.tsx`: blue cloud-plus-upload icon with a blue revolving outline
      circle.
- [x] `Lock.tsx`: blue lock animation transitioning from open to locked, with
      a blue revolving outline circle.
- [x] `Unlock.tsx`: blue lock animation transitioning from closed to open, with
      a blue revolving outline circle.
- [x] `Show.tsx`: eye animation transitioning from closed to open.
- [x] `Hide.tsx`: eye animation transitioning from open to closed.
- [x] `Search.tsx`: blue search icon with a blue revolving outline circle.

## Integration and verification

- [x] Add all animation names to the icon registry and verify source-to-target
      transitions (`from`/`to`) continue to work.
- [ ] Replace existing hard-coded animation usages with the new names where
      the new animations are intended to be used.
- [ ] Verify light/dark theme contrast, sizing, clipping, and alignment in
      toast, button, and status-card consumers.
- [ ] Verify reduced-motion behavior and accessible labels for every new
      animation.
- [ ] Run the relevant type check after implementation; do not build unless
      explicitly requested.
