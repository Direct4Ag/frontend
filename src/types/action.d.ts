interface LoadFarms {
    type: 'loadFarms',
    farms: FarmDetail[]
}

interface LoadFields {
    type: 'loadFields',
    fields: FieldsSummary[]
}

interface UpdateExploreFilter {
    type: 'updateExploreFilter',
    selectedFilter: ExploreFilter
}

type DataAction = LoadFarms | LoadFields | UpdateExploreFilter
