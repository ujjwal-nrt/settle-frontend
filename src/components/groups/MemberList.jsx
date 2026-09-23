import Avatar from '../common/Avatar';
export default function MemberList({members}){return <div className="list-card">{members.map(m=><div className="activity-row" key={m.id}><Avatar src={m.avatar} name={m.name}/><div className="row-main"><b>{m.name}</b><span>{m.id==='u1'?'You':'Member'}</span></div></div>)}</div>}
