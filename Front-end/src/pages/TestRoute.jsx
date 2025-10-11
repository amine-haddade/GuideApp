import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { updateTestMessage } from '../store/slices/AuthSlice'

function TestRoute() {
  const dispatch = useDispatch()
  const testMessage = useSelector((state) => state.Auth.testMessage)

  const handleUpdateMessage = () => {
    dispatch(updateTestMessage("Message mis à jour !"))
  }

  return (
    <div>
      <h1>Test Page</h1>
      <p>Message from Redux: {testMessage}</p>
      <button onClick={handleUpdateMessage}>
        Update Message
      </button>
    </div>
  )
}

export default TestRoute
