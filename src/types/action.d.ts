interface LoadFarms {
    type: 'loadFarms',
    farms: FarmDetail[]
}

interface LoadFields {
    type: 'loadFields',
    fields: FieldsSummary[]
}

type DataAction = LoadFarms | LoadFields
