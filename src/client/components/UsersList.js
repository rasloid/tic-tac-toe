import React, {Component} from 'react';
import PropTypes from 'prop-types';
import UsersListItem from './UsersListItem';
import uuidv4 from 'uuid/v4'

class UsersList extends Component{
    constructor(props){
        super(props);
    }

    render(){
        let listTemplate = [];
        let {ownNickname, users,...props} = this.props;
        for(let user in users){
            if(user == ownNickname) continue;
            listTemplate.push(<li key={uuidv4()} ><UsersListItem
                nickname = {user}
                isBusy={users[user]}
                //key={uuidv4()}
                {...props}
            /></li>);
        }
        return(
            <div className={'users-list'}>
                <ul>
                    {listTemplate}
                </ul>
            </div>
        );
    }
}

UsersList.propTypes ={
    ownNickname: PropTypes.string.isRequired,
    users: PropTypes.object
};
export default UsersList;