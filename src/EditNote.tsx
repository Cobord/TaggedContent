import { Navigate, useParams } from "react-router-dom"
// eslint-disable-next-line import/no-unresolved
import { Note, NoteData, Tag } from "./App"
// eslint-disable-next-line import/no-unresolved
import {NoteForm} from "./NoteForm"
// eslint-disable-next-line import/no-unresolved
import { CONTENT_NAME } from "./Content"

type EditNoteProps = {
	onEdit : (arg0: Note["id"],arg1: NoteData) => void
	onAddTag : (arg0 : Tag) => void
	availableTags : Tag[]
	startingNote : (arg0 : Note["id"]) => Note | undefined
}

export function EditNote({onEdit, onAddTag, availableTags, startingNote} : EditNoteProps) {
	const params = useParams<{id: Note["id"]}>()
	const myID = params.id
	if (!myID) {
		return <Navigate to="/" replace/>
	}
	const realStartingNote = startingNote(myID)
	if (!realStartingNote) {
		return <Navigate to="/" replace/>
	}
	const onSubmit = (nodeData: NoteData) => onEdit(myID,nodeData)
	const editTitle = `Edit ${CONTENT_NAME}`
	return (
		<>
			<h1 className="mb-4">{editTitle}</h1>
			<NoteForm onSubmit={onSubmit} onAddTag={onAddTag} availableTags={availableTags} startingNote={realStartingNote}/>
		</>
	)
}