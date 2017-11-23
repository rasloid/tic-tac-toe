import React, {Component} from 'react';
import PropTypes from 'prop-types';
import UsersListItem from './UsersListItem';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import '../styles/animation.pcss';

const Fade = ({ children, ...props }) => (
    <CSSTransition
        {...props}
        timeout={1000}
        classNames="fade"
    >
        {children}
    </CSSTransition>
);

class UsersList extends Component{
    constructor(props){
        super(props);
    }

    render(){
        let listTemplate = [];
        let {ownNickname, users,...props} = this.props;
        //delete users[ownNickname];
        for(let user in users){
            if(user == ownNickname) continue;
            listTemplate.push(
                <Fade in={!!user} key={user}>
                    <UsersListItem
                    nickname = {user}
                    isBusy={users[user]}
                    {...props}
                    />
                </Fade>);
        }
        return(
            <div className={'users-list'} key={'users-list'}>
               <ul> <TransitionGroup className='ul-wrapper'>
                    {listTemplate}
                </TransitionGroup>
                </ul>

            </div>
        );
    }
}

UsersList.propTypes ={
    ownNickname: PropTypes.string,
    users: PropTypes.object
};
export default UsersList;