# TaggedContent

Say we have several items of content each tagged with a title and some labels.
That behavior is common but the exact type of how the content is created, shown on screen and edited is different.

Here only the filenames for the exports in Content.tsx are changed to account for these differences.
The system of managing the labels, searching by title and label, deleting a piece of content and the overall structure is kept in common.

The example currently in Content.tsx is MTG decklists. Here the peculiarity for creation is that there should be numbers and card names in main deck and sideboard.
So even though it looks like 3 text boxes, they are stored as the appropriate arrays of card names with multiplicities. When reading, there is also the peculiarity of
showing an image of the card upon clicking a name (URI looked up via scryfall if it hasn't already been cached).

We can compare this with if we replace the export in Content.tsx to one where the edit/creation screen is just a text box and the read screen is just that text with no
other behavior. You only create new files in the ContentManagers subfolder and point the exports to that desired file to account for these differences.

One of the contents in the ContentManagers subfolders was a tutorial exercise, and so this is a modification to make the common aspects reused with minimal changes for different types of content.
