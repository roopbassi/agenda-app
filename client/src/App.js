import { useState, useEffect } from 'react';

const API_BASE = "HTTP://localhost:3001"
function App() {
  const [agendaItems, setAgendaItems] = useState([]);     // Store the agenda items 
  const [popupActive, setPopupActive] = useState(false);  // Popup to add new agenda items
  const [newAgendaItem, setNewAgendaItem] = useState(""); 

  useEffect (() => {
    GetAgendaItems();
  }, []);

  const GetAgendaItems = () => {
    fetch(API_BASE + "/agenda" )
    .then(res => res.json())
    .then(data => setAgendaItems(data))
    .catch(err => console.error(err));
  }

  const completeAgendaItem = async id=>{
    const data = await fetch(API_BASE + "/agenda/complete/" + id )
      .then(res => res.json());
    setAgendaItems(agendaItems.map(agendaItem => {
      if (agendaItem._id === data._id){
        agendaItem.complete = data.complete;
      }
      return agendaItem;
    }))
  }

  const deleteAgendaItem = async id => {
    const data = await fetch(API_BASE + "/agenda/delete/" + id, {
      method: "DELETE"
    }).then(res => res.json());
    
    setAgendaItems(agendaItems => agendaItems.filter(agendaItem => agendaItem._id !== data._id));
  }

  const addAgendaItem = async () => {
    const data = await fetch(API_BASE + "/agenda/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        text: newAgendaItem
      })
    }).then(res => res.json());

    setAgendaItems([...agendaItems, data]);
    setPopupActive(false);
    setNewAgendaItem("");
  }

  return (
    <div className="App">
      <h1>Welcome!</h1>
      <h4>Your Tasks</h4>

      <div className = "agendaItems">
        {agendaItems.map(agendaItem => (
          <div className = {
            "agendaItem " + (agendaItem.complete ? "is-complete" : "")
            } key = {agendaItem._id} onClick={()=> completeAgendaItem(agendaItem._id) }>
            <div className = "checkbox"></div>
            <div className = "text">{ agendaItem.text }</div>
            <div className = "delete-agendaItem" onClick={() => deleteAgendaItem
              (agendaItem._id)}>x</div>
          </div>
        ))}
      </div>

      <div className = "addPopup" onClick={() =>setPopupActive(true)}>+</div>
      {popupActive ? (
        <div className = "popup">
          <div className = "closePopup" onClick={() => setPopupActive
            (false)}>x</div>
          <div className = "content">
            <h3>Add Task</h3>
            <input
              type = "text"
              className = "add-agendaItem-input"
              onChange = {e => setNewAgendaItem(e.target.value)}
              value={newAgendaItem}/>
              <div className = "button" onClick={addAgendaItem}>Create Task</div>
          </div>
        </div>
    ) : ''}
  </div>
  );
}
export default App;