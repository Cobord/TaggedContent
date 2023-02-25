import { useRef } from "react"
import { Form } from "react-bootstrap"
import ReactMarkdown from "react-markdown"

export type ContentType = {
	markdown : string
}

const defaultContent = {
	markdown : ""
}

export const CONTENT_NAME = "Markdown Note"
export const CONTENT_NAME_PLURAL = "Markdown Notes"

export function PrettyContent({content} : {content : ContentType}) {
	return (<><ReactMarkdown>
		{content.markdown}
	</ReactMarkdown></>)
}

type RefRequired0 = React.RefObject<HTMLTextAreaElement>

type RefsRequired = [RefRequired0]

//type RefCurrentValue<T> = T extends React.RefObject<HTMLInputElement> ? NonNullable<T["current"]>["value"] : never

export function contentCreator(neededRefs : RefsRequired) : ContentType {
	const arg0 = neededRefs[0].current
	const arg0Value = arg0 ? arg0.value : defaultContent.markdown
	return {
		markdown : arg0Value
	}
}

type ContentFormProps = {
	contentRefs : RefsRequired
	controlId : string
	startingContent : ContentType | undefined
}

export function ContentForm({contentRefs,controlId,startingContent} : ContentFormProps) {
	const startingContentText = startingContent ? startingContent.markdown : defaultContent.markdown
	return (<Form.Group controlId={controlId}>
		<Form.Label>Body</Form.Label>
		<Form.Control ref={contentRefs[0]} defaultValue={startingContentText} required as="textarea" rows={15}/>
	</Form.Group>)
}

export function useContentRefs() : RefsRequired {
	return [useRef<HTMLTextAreaElement>(null)]
}