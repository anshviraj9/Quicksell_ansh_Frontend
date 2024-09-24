import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";
import Header from "./Header";
import Column from "./Column";

function App() {
  const [tickets, setTickets] = useState(() => {
    const savedTickets = localStorage.getItem("tickets");
    return savedTickets ? JSON.parse(savedTickets) : [];
  });

  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem("users");
    return savedUsers ? JSON.parse(savedUsers) : [];
  });

  const [groupBy, setGroupBy] = useState(() => {
    // Load groupBy value from localStorage, default to 'status'
    return localStorage.getItem("groupBy") || "status";
  });

  const [sortBy, setSortBy] = useState(() => {
    // Load sortBy value from localStorage, default to 'priority'
    return localStorage.getItem("sortBy") || "priority";
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tickets.length || !users.length) {
      fetch("https://api.quicksell.co/v1/internal/frontend-assignment")
        .then((response) => response.json())
        .then((data) => {
          console.log("showing data:", data);
          console.log("showing only tickets: ", data.tickets);
          console.log("showing only users: ", data.users);

          const obj1 = { status: "Done" };
          const obj2 = { status: "Cancelled" };
          data.tickets.push(obj1);
          data.tickets.push(obj2);

          setTickets(data.tickets);
          setUsers(data.users);

          localStorage.setItem("tickets", JSON.stringify(data.tickets));
          localStorage.setItem("users", JSON.stringify(data.users));

          setLoading(false);
        })
        .catch((error) => {
          console.log("Error fetching data: ", error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  // Save tickets to localStorage when tickets state changes
  useEffect(() => {
    if (tickets.length) {
      localStorage.setItem("tickets", JSON.stringify(tickets));
    }
  }, [tickets]);

  // Save users to localStorage when users state changes
  useEffect(() => {
    if (users.length) {
      localStorage.setItem("users", JSON.stringify(users));
    }
  }, [users]);

  // Save groupBy to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("groupBy", groupBy);
  }, [groupBy]);

  // Save sortBy to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("sortBy", sortBy);
  }, [sortBy]);

  const getUserName = (userId) => {
    const user = users.find((user) => user.id === userId);
    return user ? user.name : "User not found";
  };

  const groupTickets = (tickets, groupBy) => {
    const grouped = {};
    tickets.forEach((ticket) => {
      let groupKey;
      if (groupBy === "user") {
        groupKey = getUserName(ticket.userId);
      } else {
        groupKey = ticket[groupBy] || "No " + groupBy;
      }

      if (!grouped[groupKey]) {
        grouped[groupKey] = [];
      }
      grouped[groupKey].push(ticket);
    });

    return grouped;
  };

  const sortTickets = (tickets, sortBy) => {
    return tickets.sort((a, b) => {
      if (sortBy === "priority") {
        return (b.priority || 0) - (a.priority || 0);
      }
      if (sortBy === "title") {
        const titleA = a.title || "";
        const titleB = b.title || "";
        return titleA.localeCompare(titleB);
      }
      return 0;
    });
  };

  const groupedTickets = groupTickets(tickets, groupBy);
  Object.keys(groupedTickets).forEach((key) => {
    groupedTickets[key] = sortTickets(groupedTickets[key], sortBy);
  });

  if (loading) return <div>Loading...</div>;

  return (
    <div className="App">
      <Header setGroupBy={setGroupBy} setSortBy={setSortBy} />
      <div className="kanban-board">
        {Object.keys(groupedTickets).map((group) => (
          <Column
            key={group}
            title={group}
            group={groupBy}
            tickets={groupedTickets[group]}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
