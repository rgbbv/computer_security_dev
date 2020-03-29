/*global chrome*/
import React from 'react'
class popup extends React.Component {
render () {
  return (
    <form>
      <label>
        Name:
        <input type="text" name="name" />
      </label>
      <input type="submit" value="Submit" />
    </form>
  )
  }
}
export default popup;