import { useEffect, useRef, useState } from "react"
import { Col, Form, Modal, Row, Stack } from "react-bootstrap"
import styles from "./MTGDeckList.module.css"

const ALL_MTGFORMATS = ["Standard", "Pauper", "Modern", "Commander"] as const
type MTGFormat = (typeof ALL_MTGFORMATS)[number]

type CardName = string

export type ContentType = {
	decklist : [CardName,number][]
	sideboard : [CardName,number][]
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

export const contentDefaultTags = ["Black","Blue","Red","Green","White","Colorless","Aggro","Midrange","Control","Discard","Mill","Combo","Tribal","Tokens","Sacrifice"]

export function PrettyContent({content} : {content : ContentType}) {
	const [showModal,setShowModal] = useState<CardName | undefined>(undefined)

	const deckListElement = (
		<div className={styles.decklist}>
			<h3>DeckList</h3>
			<ul>
				{content.decklist.map(cardName => <li key={cardName[0]} onClick={()=>setShowModal(cardName[0])}>{`${cardName[1]}  ${cardName[0]}`}</li>)}
			</ul>
		</div>
	)

	const sideboardElement = (
		<div className={styles.sideboard}>
			<h3>Sideboard</h3>
			{content.sideboard.length>0 ?
				(<ul>
					{content.sideboard.map(cardName => <li key={cardName[0]} onClick={()=>setShowModal(cardName[0])}>{`${cardName[1]}  ${cardName[0]}`}</li>)}
				</ul>) : <></>}
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
	show : CardName | undefined
	handleClose : () => void
}

function PrettyCardModal({show ,handleClose} : PrettyCardModalProps) {
	type ImageSrc = string
	const [imageSrc, setImgSrc] = useState<ImageSrc | undefined>(undefined)
	const [imageSrcs, setImgSrcs] = useState<[CardName,ImageSrc | undefined][]>([])
	useEffect(() => {
		async function getImgSrc() {
			if (!show) {
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				setImgSrc(_oldImageSrc => undefined)
				return
			}
			const x = imageSrcs.find((value : [CardName,ImageSrc | undefined]) => value[0]===show)?.[1]
			if (x) {
				console.log("Knew it already")
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				setImgSrc(_oldImageSrc => x)
				return
			}
			const scryFallUrl = `https://api.scryfall.com/cards/named?exact=${show}`
			try {
				const response = await fetch(scryFallUrl, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Accept: "application/json",
					},
				})
				if (!response.ok) {
					setImgSrcs(oldImageSrcs => [...oldImageSrcs,[show,undefined]])
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					setImgSrc(_oldImageSrc => undefined)
				} else {
					const result = (await response.json())
					const result2 = result as {image_uris : {small : string}}
					const result3 = result2.image_uris.small
					setImgSrcs(oldImageSrcs => [...oldImageSrcs,[show,result3]])
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					setImgSrc(_oldImageSrc => result3)
				}
			}
			catch (error) {
				setImgSrcs(oldImageSrcs => [...oldImageSrcs,[show,undefined]])
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				setImgSrc(_oldImageSrc => undefined)
			}
		}
		getImgSrc()
	}, [show])

	return (<Modal show={show !== undefined} onHide={handleClose} className={styles.cardModal}>
		<Modal.Header className={styles.cardModal}>
			<Col>
				<Modal.Title>{show} Detail</Modal.Title>
			</Col>
		</Modal.Header>
		<Modal.Body className={styles.cardModal}>
			{show !==undefined ? <img className={styles.center} src={imageSrc} alt={show}></img> : <p>Card not found</p>}
		</Modal.Body>
	</Modal>)
}

type RefRequired0 = React.RefObject<HTMLTextAreaElement>
type RefRequired1 = React.RefObject<HTMLSelectElement>

type RefsRequired = [RefRequired0,RefRequired0,RefRequired0,RefRequired1]

//type RefCurrentValue<T> = T extends React.RefObject<HTMLInputElement> ? NonNullable<T["current"]>["value"] : never

const capturingRegex = /(?<cardNumber>[0-9]+) (?<cardName>[a-zA-Z0-9 ]+)/

function parseCardMultiplicity(x : string) : [CardName,number] | undefined {
	const found = x.match(capturingRegex)
	if (!found || !found.groups) {
		return undefined
	}
	const cardName = found.groups.cardName
	const cardNumber = found.groups.cardNumber
	return [cardName,parseInt(cardNumber)]
}

function isPresent(value: [string, number] | undefined): value is [string, number] {
	if (value === undefined) {
		return false
	}
	return true
}


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
		decklist : arg0Value.split(/\r?\n/).map(parseCardMultiplicity).filter(isPresent),
		sideboard : arg1Value.split(/\r?\n/).map(parseCardMultiplicity).filter(isPresent),
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
	const startingDecklistText = startingContent ? startingContent.decklist.map(s => `${s[1]} ${s[0]}`) : defaultContent.decklist
	const startingSideboardText = startingContent ? startingContent.sideboard.map(s => `${s[1]} ${s[0]}`) : defaultContent.sideboard
	const startingExtraNotesText = startingContent ? startingContent.extraNotes : defaultContent.extraNotes
	const startingFormat = startingContent ? startingContent.format : defaultContent.format
	return (<Form.Group controlId={controlId}>
		<Stack gap={4}>
			<Row>
				<Form.Control as="select" defaultValue={startingFormat} ref={contentRefs[3]}>
					{ALL_MTGFORMATS.map(format => {
						return <option key={format} value={format}>{format}</option>
					})}
				</Form.Control>
			</Row>
			<Row>
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
			</Row>
		</Stack>
	</Form.Group>)
}

export function useContentRefs() : RefsRequired {
	return [useRef<HTMLTextAreaElement>(null),useRef<HTMLTextAreaElement>(null),useRef<HTMLTextAreaElement>(null),useRef<HTMLSelectElement>(null)]
}