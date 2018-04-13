export default function linkState(self) {
  const onChanges = {}
  return (name, valueKey = 'value') => {
    if (onChanges[name]) {
      return {
        onChange: onChanges[name],
        [valueKey]: self.state[name],
      }
    }
    onChanges[name] = e => {
      self.setState({
        [name]: e.target[valueKey],
      })
    }
    return {
      onChange: onChanges[name],
      [valueKey]: self.state[name],
    }
  }
}
