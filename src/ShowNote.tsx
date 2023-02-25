import { Link, Navigate, useParams } from "react-router-dom"
// eslint-disable-next-line import/no-unresolved
import { Note } from "./App"
// eslint-disable-next-line import/no-unresolved
import { PrettyContent } from "./Content"
import { Badge, Button, Col, Row, Stack } from "react-bootstrap"

type ShowNoteProps = {
	curNote : (arg0 : Note["id"]) => Note | undefined,
	onDelete : (arg0 : Note["id"]) => void
}

export function ShowNote({curNote, onDelete} : ShowNoteProps) {
	const params = useParams<{id: Note["id"]}>()
	const myID = params.id
	if (!myID) {
		return <Navigate to="/" replace/>
	}
	const realCurNote = curNote(myID)
	if (!realCurNote) {
		return <Navigate to="/" replace/>
	}
	const titleTags = (<>
		<h1>{realCurNote.title}</h1>
		{realCurNote.tags.length>0 && (
			<Stack direction="horizontal" gap={1} className="justify-content-center flex-wrap">
				{realCurNote.tags.map(tag => (
					<Badge className="text-truncate" key={tag.id}>
						{tag.label}
					</Badge>
				))}
			</Stack>
		)}
	</>)

	const buttons = (<>
		<Stack gap={2} direction="horizontal">
			<Link to={`/${myID}/edit`}>
				<Button variant="primary">Edit</Button>
			</Link>
			<Button variant="outline-danger" onClick={() => onDelete(myID)}>Delete</Button>
			<Link to="/">
				<Button variant="outline-secondary">Cancel</Button>
			</Link>
		</Stack>
	</>)

	return (
		<Stack gap={4}>
			<Row className="align-items-center mb-4">
				<Col>{titleTags}</Col>
				<Col xs="auto">{buttons}</Col>
			</Row>
			<Row>
				<PrettyContent content={realCurNote.content} />
			</Row>
		</Stack>
	)
}