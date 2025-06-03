import React, { useState } from "react";
import "./TeamAssignmentAccordion.css";

function AccordionSection({ title, people, selected, toggle }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        className={`accordion-button ${open ? "active" : ""}`}
        onClick={() => setOpen(!open)}
      >
        {title}
      </button>
      {open && (
        <div className="accordion-panel">
          {people.map((person, index) => (
            <label key={index} className="checkbox-item">
              <input
                type="checkbox"
                checked={selected.includes(person.email)}
                onChange={() => toggle(person.email)}
              />
              {person.name} – {person.email}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

export default function TeamAssignmentAccordion({ selected, setSelected }) {
  const toggle = (email) => {
    setSelected((prev) =>
      prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email]
    );
  };

  const techs = [
    { name: "Eddy Ramirez", email: "eramirez@cjdconsult.com" },
    { name: "Jaime Landicho", email: "jlandicho@cjdconsult.com" },
    { name: "Kenneth Liptak", email: "kliptak@cjdconsult.com" },
    { name: "Brian Jones", email: "bjones@cjdconsult.com" },
    { name: "Jesus Graciano", email: "jgraciano@cjdconsult.com" },
    { name: "James Andryshak", email: "jandryshak@cjdconsult.com" },
  ];

  const pms = [
    { name: "Ed Santana", email: "esantana@cjdconsult.com" },
    { name: "Enrique Suarez", email: "esuarez@cjdconsult.com" },
  ];

  const subs = [
    { name: "Ryan Anne Langton (S&J)", email: "rlangton@sjdatatech.com" },
  ];

  const coordinators = [
    { name: "Nick Curcio", email: "ncurcio@cjdconsult.com" },
    { name: "Trevor Mack", email: "tmack@cjdconsult.com" },
    { name: "Ryan Francis", email: "rfrancis@cjdconsult.com" },
  ];

  return (
    <div className="accordion-container">
      <AccordionSection title="Techs" people={techs} selected={selected} toggle={toggle} />
      <AccordionSection title="PMs" people={pms} selected={selected} toggle={toggle} />
      <AccordionSection title="Subs" people={subs} selected={selected} toggle={toggle} />
      <AccordionSection title="Coordinators" people={coordinators} selected={selected} toggle={toggle} />
    </div>
  );
}
