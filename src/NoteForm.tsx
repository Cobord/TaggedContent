import { FormEvent, useRef, useState } from "react"
import { Row, Col, Form, Stack, Button } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import CreatableReactSelect from "react-select/creatable"
// eslint-disable-next-line import/no-unresolved
import { Note, NoteData, Tag } from "./App"
// eslint-disable-next-line import/no-unresolved
import { ContentForm, contentCreator, useContentRefs } from "./Content"
import {v4 as uuidv4} from "uuid"

type NoteFormProps = {
	onSubmit : (arg0: NoteData) => void
	onAddTag : (arg0 : Tag) => void
	availableTags : Tag[]
	startingNote? : Note
}

export function NoteForm({onSubmit, onAddTag, availableTags, startingNote} : NoteFormProps) {
	const startingTitle = startingNote ? startingNote.title : ""
	const startingTags = startingNote === undefined ? [] : startingNote.tags
	const titleRef = useRef<HTMLInputElement>(null)
	const neededRefs = useContentRefs()
	const [myTags,setMyTags] = useState<Tag[]>(startingTags)
	const navigate = useNavigate()

	function handleSubmit(e : FormEvent) {
		e.preventDefault()
		onSubmit({
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			title : titleRef.current!.value,
			content : contentCreator(neededRefs),
			tags : myTags
		})
		navigate("..")
	}

	return <Form onSubmit={handleSubmit}>
		<Stack gap={4}>
			<Row>
				<Col>
					<Form.Group controlId="title">
						<Form.Label>Title</Form.Label>
						<Form.Control ref={titleRef} defaultValue={startingTitle} required />
					</Form.Group>
				</Col>
				<Col>
					<Form.Group controlId="tags">
						<Form.Label>Tags</Form.Label>
						<CreatableReactSelect
							value={myTags.map(tag => {return {label : tag.label, value : tag.id}})}
							onChange={tags => {
								setMyTags(tags.map(tag => {return {label : tag.label, id : tag.value}}))
							}}
							onCreateOption={label => {
								const newTag = {id : uuidv4(), label : label}
								onAddTag(newTag)
							}}
							options={availableTags.map(tag => {return {
								label : tag.label,value : tag.id}
							})}
							isMulti/>
					</Form.Group>
				</Col>
			</Row>
			<ContentForm contentRefs={neededRefs}
				controlId="content"
				startingContent={startingNote ? startingNote.content : undefined} />
			<Stack direction="horizontal" gap={2} className="justify-content-end">
				<Button type="submit">Submit</Button>
				<Link to="..">
					<Button type="button" variant="outline-secondary">Cancel</Button>
				</Link>
			</Stack>
		</Stack>
	</Form>
}