// eslint-disable-next-line import/no-unresolved
import { Note, Tag } from "./App"
import { Link } from "react-router-dom"
import { useMemo, useState } from "react"
import ReactSelect from "react-select"
import styles from "./NoteList.module.css"
import { Col, Row, Stack, Button, Form, Card, Badge, Modal } from "react-bootstrap"
// eslint-disable-next-line import/no-unresolved
import { CONTENT_NAME_PLURAL } from "./Content"

type NoteListProps = {
	allNotes : Note[]
	availableTags : Tag[]
	onEditTag : (arg0 : Tag["id"], newLabel : Tag["label"]) => void
	onDeleteTag : (arg0 : Tag["id"]) => void
	onRestoreDefaultTags : () => void
}

export function NoteList({allNotes, availableTags, onEditTag, onDeleteTag, onRestoreDefaultTags} : NoteListProps) {
	const [myTags,setMyTags] = useState<Tag[]>([])
	const [myTitle,setMyTitle] = useState<Note["title"]>("")
	const [showModal,setShowModal] = useState<boolean>(false)

	const filteredNotes = useMemo( () => {
		return allNotes
			.filter(note => {
				return note.title.toLowerCase().includes(myTitle.toLowerCase())
			})
			.filter(note => {
				return myTags.every(tag => note.tags.map(noteTag=>(noteTag.id)).includes(tag.id))
			})
	},[allNotes,myTitle,myTags]
	)

	const unusedTagIDs = useMemo( () => {
		const someNoteIncludesThisTag = (tagId : Tag["id"]) => allNotes.some(rawNote => rawNote.tags.map(tag => tag.id).includes(tagId))
		return availableTags.map(tag => tag.id).filter(tagID => !someNoteIncludesThisTag(tagID))
	},[allNotes,availableTags])

	const noteListTitle = `All ${CONTENT_NAME_PLURAL}`

	return (
		<>
			<Row>
				<Col><h1>{noteListTitle}</h1></Col>
				<Col xs="auto">
					<Stack gap={2} direction="horizontal">
						<Link to="/new">
							<Button variant="primary">Create</Button>
						</Link>
						<Button variant="secondary" onClick={() => setShowModal(true)}>Edit Tags</Button>
					</Stack>
				</Col>
			</Row>
			<Form>
				<Row className="mb-4">
					<Col>
						<Form.Group controlId="title">
							<Form.Label>Title</Form.Label>
							<Form.Control auto-complete="off" type="text" value={myTitle} onChange = {e => setMyTitle(e.target.value)}/>
						</Form.Group>
					</Col>
					<Col>
						<Form.Group controlId="tags">
							<Form.Label>Tags</Form.Label>
							<ReactSelect
								value={myTags.map(tag => {return {label : tag.label, value : tag.id}})}
								onChange={tags => {
									setMyTags(tags.map(tag => {return {label : tag.label, id : tag.value}}))
								}}
								options={availableTags.map(tag => {return {
									label : tag.label,value : tag.id}
								})}
								isMulti/>
						</Form.Group>
					</Col>
				</Row>
			</Form>
			<Row xs={1} sm={2} lg={3} xl={4} className="g-3">
				{filteredNotes.map( curNote => (
					<Col key={curNote.id}>
						<NoteCard title={curNote.title} id={curNote.id} tags={curNote.tags}/>
					</Col>
				))}
			</Row>
			<EditTagsModal show={showModal} handleClose={() => {setShowModal(false)}}
				availableTags={availableTags} unusedTags={unusedTagIDs}
				onEditTag={onEditTag} onDeleteTag={onDeleteTag} onRestoreDefaultTags={onRestoreDefaultTags}/>
		</>
	)
}

type NoteCardProps = {
	title : Note["title"]
	id : Note["id"]
	tags : Note["tags"]
}

function NoteCard({title,id,tags} : NoteCardProps) {
	return <Card as={Link} to={`/${id}`} className={`h-100 text-reset text-decoration-none ${styles.card}`}>
		<Card.Body>
			<Stack gap={2} className="align-items-center justify-content-center h-100">
				<span className="fs-5">
					{title}
				</span>
				{tags.length>0 && (
					<Stack direction="horizontal" gap={1} className="justify-content-center flex-wrap">
						{tags.map(tag => (
							<Badge className="text-truncate" key={tag.id}>
								{tag.label}
							</Badge>
						))}
					</Stack>
				)}
			</Stack>
		</Card.Body>
	</Card>
}

type EditTagsProps = {
	availableTags : Tag[]
	unusedTags : Tag["id"][]
	show : boolean
	handleClose : () => void
	onEditTag : (arg0 : Tag["id"], arg1 : Tag["label"]) => void
	onDeleteTag : (arg0 : Tag["id"]) => void
	onRestoreDefaultTags : () => void
}

function EditTagsModal({availableTags, unusedTags, show, handleClose,onEditTag,onDeleteTag,onRestoreDefaultTags} : EditTagsProps) {
	const deleteAllUnused = () => {
		unusedTags.forEach(tagID => onDeleteTag(tagID))
	}
	return (<Modal show={show} onHide={handleClose}>
		<Modal.Header>
			<Col>
				<Modal.Title>Edit Tags</Modal.Title>
			</Col>
			<Col>
				<Button variant="outline-danger" onClick={deleteAllUnused}>
					Delete All Unused Tags
				</Button>
			</Col>
			<Col>
				<Button variant="outline-secondary" onClick={onRestoreDefaultTags}>
					Restore Default Tags
				</Button>
			</Col>
		</Modal.Header>
		<Modal.Body>
			<Form>
				<Stack gap={2}>
					{availableTags.map(tag => (
						<Row key={tag.id}>
							<Col xs="auto">
								<Form.Control type="text" value={tag.label} onChange={(e) => onEditTag(tag.id,e.target.value)} />
							</Col>
							<Col xs="auto">
								<Button variant="outline-danger" onClick={() => onDeleteTag(tag.id)}>
									&times;
								</Button>
							</Col>
						</Row>
					))}
				</Stack>
			</Form>
		</Modal.Body>
	</Modal>)
}
