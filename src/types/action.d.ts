interface LoadReserches {
    type: 'loadResearches',
    farms: ResearchDetail[]
}

interface UpdateExploreFilter {
    type: 'updateExploreFilter',
    selectedFilter: ExploreFilter
}

type DataAction = LoadResearches | UpdateExploreFilter
