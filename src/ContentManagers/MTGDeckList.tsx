import { useRef, useState } from "react"
import { Col, Form, Modal, Row, Stack } from "react-bootstrap"
import styles from "./MTGDeckList.module.css"

const ALL_MTGFORMATS = ["Standard", "Pauper", "Modern", "Commander"] as const
type MTGFormat = (typeof ALL_MTGFORMATS)[number]

export type ContentType = {
	decklist : string[]
	sideboard : string[]
	extraNotes : string
	format : MTGFormat
}

const defaultContent = {
	decklist : [],
	sideboard : [],
	extraNotes : "",
	format : "Standard"
} as ContentType

export const CONTENT_NAME = "MTG DeckList"
export const CONTENT_NAME_PLURAL = "MTG DeckLists"

export const contentDefaultTags = ["Black","Blue","Red","Green","White","Colorless","Aggro","Midrange","Control","Discard","Mill","Combo"]

export function PrettyContent({content} : {content : ContentType}) {
	const [showModal,setShowModal] = useState<string | undefined>(undefined)

	const deckListElement = (
		<div className={styles.decklist}>
			<ul>
				{content.decklist.map(cardName => <li key={cardName} onClick={()=>setShowModal(cardName)}>{cardName}</li>)}
			</ul>
		</div>
	)

	const sideboardElement = (
		<div className={styles.sideboard}>
			<ul>
				{content.sideboard.map(cardName => <li key={cardName} onClick={()=>setShowModal(cardName)}>{cardName}</li>)}
			</ul>
		</div>
	)

	return (<>
		<Stack direction="horizontal" gap={4}>
			<Col>
				{deckListElement}
			</Col>
			<Col>
				<Stack direction="vertical" gap={4}>
					<Row>
						{sideboardElement}
					</Row>
					<Row>
						<p className={styles.extraNotes}>
							{content.extraNotes}
						</p>
					</Row>
				</Stack>
			</Col>
		</Stack>
		<PrettyCardModal show={showModal} handleClose={()=>setShowModal(undefined)}/>
	</>)
}

type PrettyCardModalProps = {
	show : string | undefined
	handleClose : () => void
}

function PrettyCardModal({show ,handleClose} : PrettyCardModalProps) {
	return (<Modal show={show !== undefined} onHide={handleClose}>
		<Modal.Header>
			<Col>
				<Modal.Title>{show} Detail</Modal.Title>
			</Col>
		</Modal.Header>
		<Modal.Body>
		</Modal.Body>
	</Modal>)
}

type RefRequired0 = React.RefObject<HTMLTextAreaElement>
type RefRequired1 = React.RefObject<HTMLSelectElement>

type RefsRequired = [RefRequired0,RefRequired0,RefRequired0,RefRequired1]

//type RefCurrentValue<T> = T extends React.RefObject<HTMLInputElement> ? NonNullable<T["current"]>["value"] : never

export function contentCreator(neededRefs : RefsRequired) : ContentType {
	const arg0 = neededRefs[0].current
	const arg0Value = arg0 ? arg0.value : defaultContent.decklist.join("\n")
	const arg1 = neededRefs[1].current
	const arg1Value = arg1 ? arg1.value : defaultContent.sideboard.join("\n")
	const arg2 = neededRefs[2].current
	const arg2Value = arg2 ? arg2.value : defaultContent.extraNotes
	const arg3 = neededRefs[3].current
	const arg3Value = arg3 ? arg3.value : defaultContent.format
	return {
		decklist : arg0Value.split(/\r?\n/),
		sideboard : arg1Value.split(/\r?\n/),
		extraNotes : arg2Value,
		format : arg3Value as MTGFormat
	}
}

type ContentFormProps = {
	contentRefs : RefsRequired
	controlId : string
	startingContent : ContentType | undefined
}

export function ContentForm({contentRefs,controlId,startingContent} : ContentFormProps) {
	const startingDecklistText = startingContent ? startingContent.decklist : defaultContent.decklist
	const startingSideboardText = startingContent ? startingContent.sideboard : defaultContent.sideboard
	const startingExtraNotesText = startingContent ? startingContent.extraNotes : defaultContent.extraNotes
	const startingFormat = startingContent ? startingContent.format : defaultContent.format
	return (<Form.Group controlId={controlId}>
		<Form.Control as="select" defaultValue={startingFormat} ref={contentRefs[3]}>
			{ALL_MTGFORMATS.map(format => {
				return <option key={format} value={format}>{format}</option>
			})}
		</Form.Control>
		<Stack direction="horizontal" gap={4}>
			<Col>
				<Form.Label>DeckList</Form.Label>
				<Form.Control ref={contentRefs[0]} defaultValue={startingDecklistText.join("\n")} required as="textarea" rows={25}/>
			</Col>
			<Col>
				<Stack gap={2}>
					<Row>
						<Form.Label>Sideboard</Form.Label>
						<Form.Control ref={contentRefs[1]} defaultValue={startingSideboardText.join("\n")} as="textarea" rows={6}/>
					</Row>
					<Row>
						<Form.Label>Extra Notes</Form.Label>
						<Form.Control ref={contentRefs[2]} defaultValue={startingExtraNotesText} as="textarea" rows={14}/>
					</Row>
				</Stack>
			</Col>
		</Stack>
	</Form.Group>)
}

export function useContentRefs() : RefsRequired {
	return [useRef<HTMLTextAreaElement>(null),useRef<HTMLTextAreaElement>(null),useRef<HTMLTextAreaElement>(null),useRef<HTMLSelectElement>(null)]
}