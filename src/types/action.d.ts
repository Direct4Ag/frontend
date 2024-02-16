interface LoadReserches {
    type: 'loadResearches',
    farms: ResearchDetail[]
}

interface LoadFields {
    type: 'loadFields',
    fields: FieldsSummary[]
}

interface UpdateExploreFilter {
    type: 'updateExploreFilter',
    selectedFilter: ExploreFilter
}

interface UpdateSelectedField {
    type: 'updateSelectedField',
    selectedField: FieldsSummary | null
}

interface UpdateSelectedResearch {
    type: 'updateSelectedresearch',
    selectedResearch: ResearchDetail | null
}

type DataAction = LoadResearches | UpdateExploreFilter | LoadFields | UpdateSelectedField | UpdateSelectedResearch
