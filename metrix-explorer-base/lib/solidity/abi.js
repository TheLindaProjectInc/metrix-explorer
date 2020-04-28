const ethjsABI = require('ethereumjs-abi')
const mrc20List = require('./mrc20-abi.json')
const mrc721List = require('./mrc721-abi.json')

function getTypes(abi, category) {
  let result = []
  for (let item of abi[category]) {
    if (item.type === 'tuple') {
      result.push(`(${getTypes({[category]: item.components}).join(',')})`)
    } else {
      result.push(item.type)
    }
  }
  return result
}

class MethodABI {
  #id = null

  constructor({type = 'function', name, stateMutability, inputs = [], outputs = []}) {
    this.type = type
    this.name = name
    this.stateMutability = stateMutability
    this.inputs = inputs
    this.outputs = outputs
  }

  get id() {
    this.#id = this.#id || ethjsABI.methodID(this.name, getTypes(this, 'inputs'))
    return this.#id
  }

  encodeInputs(params) {
    return ethjsABI.rawEncode(getTypes(this, 'inputs'), params)
  }

  decodeInputs(data) {
    return ethjsABI.rawDecode(getTypes(this, 'inputs'), data)
  }

  encodeOutputs(params) {
    return ethjsABI.rawEncode(getTypes(this, 'outputs'), params)
  }

  decodeOutputs(data) {
    return ethjsABI.rawDecode(getTypes(this, 'outputs'), data)
  }
}

class EventABI {
  #id = null

  constructor({name, anonymous = false, inputs = []}) {
    this.type = 'event'
    this.name = name
    this.anonymous = anonymous
    this.inputs = inputs
  }

  get id() {
    this.#id = this.#id || ethjsABI.eventID(this.name, getTypes(this, 'inputs'))
    return this.#id
  }

  encode(params) {
    let topics = []
    let unindexedInputs = this.inputs.filter(input => !input.indexed)
    let unindexedParams = []
    for (let index = 0; index < this.inputs.length; ++index) {
      let input = this.inputs[index]
      if (input.indexed) {
        topics.push(ethjsABI.rawEncode(
          getTypes({inputs: [input]}, 'inputs'),
          [params[index]]
        ))
      } else {
        unindexedInputs.push(input)
        unindexedParams.push(params[index])
      }
    }
    let data = ethjsABI.rawEncode(
      getTypes({inputs: unindexedInputs}, 'inputs'),
      unindexedParams
    )
    return {topics, data}
  }

  decode({topics, data}) {
    let indexedInputs = this.inputs.filter(input => input.indexed)
    let unindexedInputs = this.inputs.filter(input => !input.indexed)
    let indexedParams = []
    for (let index = 0; index < topics.length; ++index) {
      let input = indexedInputs[index]
      let [param] = ethjsABI.rawDecode(getTypes({inputs: [input]}, 'inputs'), topics[index])
      indexedParams.push(param)
    }
    let unindexedParams = ethjsABI.rawDecode(getTypes({inputs: unindexedInputs}, 'inputs'), data)
    let params = []
    for (let index = 0, i = 0, j = 0; index < this.inputs.length; ++index) {
      let input = this.inputs[index]
      if (input.indexed) {
        params.push(indexedParams[i++])
      } else {
        params.push(unindexedParams[j++])
      }
    }
    return params
  }
}

function transformABIList(abiList) {
  return abiList.map(abi => {
    if (abi.type === 'function') {
      return new MethodABI(abi)
    } else if (abi.type === 'event') {
      return new EventABI(abi)
    }
  })
}

const mrc20ABIs = transformABIList(mrc20List)
const mrc721ABIs = transformABIList(mrc721List)

Object.assign(exports, {MethodABI, EventABI, mrc20ABIs, mrc721ABIs})
