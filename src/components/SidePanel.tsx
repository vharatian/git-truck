import styled from "styled-components"

export const SidePanelRoot = styled.aside`
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`

export function SidePanel(props: { children: React.ReactNode }) {
  return <SidePanelRoot>{props.children}</SidePanelRoot>
}
