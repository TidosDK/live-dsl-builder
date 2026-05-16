export const defaultMetaDSL = `<Statemachine>   ::= "name" <Name> "states" { <State> }
<State>          ::= "state" <Name> { <Connection> }
<Connection>     ::= "connection" <Name> <Targetstate>
<Targetstate>    ::= <Name>
<Name>           ::= <ID>
`;

export const defaultApplicationDSL = `name "Music Player"
states
    state "Stopped"
        connection "Start playing" "Playing"

    state "Playing"
        connection "Stop playing" "Stopped"
        connection "Pause playing" "Paused"

    state "Paused"
        connection "Start playing again" "Playing"
        connection "Stop playing" "Stopped"
`;
