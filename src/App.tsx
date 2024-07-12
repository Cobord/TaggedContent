import "bootstrap/dist/css/bootstrap.css"
import { Container } from "react-bootstrap"
import { Routes, Route, Navigate } from "react-router-dom"
// eslint-disable-next-line import/no-unresolved
import {NewNote} from "./NewNote"
// eslint-disable-next-line import/no-unresolved
import { useLocalStorage } from "./useLocalStorage"
import { useMemo, useState } from "react"
import {v4 as uuidv4} from "uuid"
// eslint-disable-next-line import/no-unresolved
import { EditNote } from "./EditNote"
// eslint-disable-next-line import/no-unresolved
import { NoteList } from "./NoteList"
// eslint-disable-next-line import/no-unresolved
import { ShowNote } from "./ShowNote"
// eslint-disable-next-line import/no-unresolved
import { CONTENT_NAME_PLURAL, ContentType, contentDefaultTags } from "./Content"

export type NoteData = {
	title : string,
	content : ContentType,
	tags : Tag[],
	dateCreated: Date,
	dateUpdated: Date
}

export type Tag = {
	id : string,
	label : string
}

export type Note = {
	id : string
} & NoteData

export type RawNoteData = {
	tagIds : Tag["id"][]
} & Omit<NoteData,"tags">

export type RawNote = {
	id : Note["id"]
} & RawNoteData

function App() {
	const [allRawNotes,setAllRawNotes] = useLocalStorage<RawNote[]>("NOTES",[])
	const [allTags,setAllTags] = useLocalStorage<Tag[]>("TAGS",[])

	const allFullNotes = useMemo( () => {
		return allRawNotes.map(rawNote => {
			return {...rawNote,tags : allTags.filter(tag => (
				rawNote.tagIds.includes(tag.id)
			))}
		}).sort((a, b) => a.dateUpdated>b.dateUpdated ? -1 : 1)
	},[allRawNotes,allTags]
	)

	function onCreateNote(data : NoteData) {
		setAllRawNotes(
			prevRawNotes => {
				const newNote = {...data,id : uuidv4(), tagIds : data.tags.map(tag => tag.id)} as RawNote
				return [...prevRawNotes, newNote]
			}
		)
	}

	function onDeleteNote(id : Note["id"]) {
		setAllRawNotes(
			prevRawNotes => (prevRawNotes.filter(note => note.id !== id))
		)
	}

	function getNote(myID : Note["id"]): Note | undefined {
		return allFullNotes.find((note) => note.id === myID)
	}

	function onEditNote(noteId : Note["id"] ,data : NoteData) {
		const modifyAtId = (r : RawNote) => (r.id==noteId ?
			{title : data.title,
				content : data.content,
				tagIds : data.tags.map(t => t.id),
				id : noteId,
				dateCreated: r.dateCreated,
				dateUpdated: new Date()}
			: r)
		setAllRawNotes(
			prevRawNotes => (prevRawNotes.map(modifyAtId).sort((a, b) => a.dateUpdated>b.dateUpdated ? -1 : 1))
		)
	}

	function onNewTag(newTag : Tag) {
		setAllTags(
			prevAllTags => {return [...prevAllTags, newTag]}
		)
	}

	function onEditTag(tagId : Tag["id"], newLabel : Tag["label"]) {
		const modifyAtId = (t : Tag) => (t.id==tagId ? {id : t.id, label : newLabel} :t)
		setAllTags(
			prevAllTags => {return prevAllTags.map(modifyAtId)}
		)
	}

	function onDeleteTag(tagId : Tag["id"]) {
		const someNoteIncludesThisTag = allRawNotes.some(rawNote => rawNote.tagIds.includes(tagId))
		if (someNoteIncludesThisTag) {
			alert(`Deleting this tag will remove it from some of your ${CONTENT_NAME_PLURAL}. This is not just deleting an unused tag.`)
		}
		setAllTags(
			prevAllTags => (prevAllTags.filter(tag => tag.id !== tagId))
		)
	}

	const [defaultTagsLoaded,setDefaultTagsLoaded] = useState<boolean>(false)
	if (!defaultTagsLoaded) {
		contentDefaultTags
			.filter(defaultTagLabel => !allTags.map(t => t.label.toLowerCase()).includes(defaultTagLabel.toLowerCase()))
			.forEach(defaultTagLabel => {
				const newTag = {id : uuidv4(), label : defaultTagLabel}
				onNewTag(newTag)
			})
		setDefaultTagsLoaded(true)
	}

	return (
		<Container className="my-2">
			<Routes>
				<Route path="/" element={<NoteList allNotes={allFullNotes}
					availableTags={allTags} onEditTag={onEditTag}
					onDeleteTag={onDeleteTag}
					onRestoreDefaultTags={()=>setDefaultTagsLoaded(false)}/>}/>
				<Route path="/new" element={<NewNote onSubmit={onCreateNote}
					onAddTag={onNewTag} availableTags={allTags} />}/>
				<Route path="/:id">
					<Route index element = {<ShowNote curNote={getNote}
						onDelete={onDeleteNote}/>} />
					<Route path="edit" element = {<EditNote onEdit={onEditNote}
						onAddTag={onNewTag} availableTags={allTags} startingNote={getNote} />} />
				</Route>
				<Route path="/*" element={<Navigate to="/"/>}/>
			</Routes>
		</Container>
	)
}

export default App
