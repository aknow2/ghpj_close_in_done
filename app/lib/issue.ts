
export interface Issue {
  id: string
  title: string
  number: number
  projectItems: {
    nodes: [
      { id: string, status: string|null }[]
    ]
  }
}

