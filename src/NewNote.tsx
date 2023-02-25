// eslint-disable-next-line import/no-unresolved
import { NoteData, Tag } from "./App"
// eslint-disable-next-line import/no-unresolved
import { CONTENT_NAME } from "./Content"
// eslint-disable-next-line import/no-unresolved
import {NoteForm} from "./NoteForm"

type NewNoteProps = {
	onSubmit : (arg0: NoteData) => void
	onAddTag : (arg0 : Tag) => void
	availableTags : Tag[]
}

export function NewNote({onSubmit, onAddTag, availableTags} : NewNoteProps) {
	const newNoteTitle = `New ${CONTENT_NAME}`
	return (
		<>
			<h1 className="mb-4">{newNoteTitle}</h1>
			<NoteForm onSubmit={onSubmit} onAddTag={onAddTag} availableTags={availableTags}/>
		</>
	)
}