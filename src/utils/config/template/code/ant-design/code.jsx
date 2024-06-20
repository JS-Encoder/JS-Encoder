const { Button, Modal } = window.antd

class App extends React.Component {
  render() {
    return (
      <div>
        <Button type="primary">This is a template of Ant Design!</Button>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById("root"))