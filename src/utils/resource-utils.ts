const generateResource = (model: object, properties: object | null = null, actions: object | null = null, 
  listOrder: string[] | null, editOrder: string[] | null, showOrder: string[] | null, lisfilterOrdertOrder: string[] | null) => {
  return {
    resource: model,
    options: {
      properties: {
        createdAt: {
          type: 'datetime',
          isVisible: { add: false, edit: false, list: true, show: true, filter: true }
        },
        updatedAt: {
          type: 'datetime',
          isVisible: { add: false, edit: false, list: true, show: true, filter: true }
        },
        ...properties
      },
      actions: actions,
      listProperties: listOrder,
      editProperties: editOrder,
      showProperties: showOrder,
      filterProperties: lisfilterOrdertOrder,
    }
  }
}

const generateType = (type: string, add: boolean, list: boolean, edit: boolean, filter: boolean, show: boolean) => {
  return {
    type: type,
    isVisible: {
      add: add, list: list, edit: edit, filter: filter, show: show
    }
  }
}

export { generateResource, generateType }
