import React, { useEffect, useState, useCallback } from "react";
import "./home-component.css";
import { useAppData } from "../../providers/AppProvider";
import { User } from "../../model/user";
import { UserService } from "../../service/user-service";
import Loader from "../global/loader";

const HomeComponent = () => {
  const {appData}= useAppData()
  const userSvc = new UserService();
  const [isLoading, setIsLoading] = useState(true);
  const [time, setTime] = useState<string | null>(null);
  const [userList, setUserList] = useState<User[]>([]);

  const getData = useCallback(async () => {
    setIsLoading(true);
    try {
      if (appData.user.role=='admin') {
        const users = await userSvc.getAllUsers();
        console.log(users,"users")
        setUserList(users ?? []);
      } else {
        const serverTime = await userSvc.getServerTime();
        setTime(serverTime ?? '');
      }
    } catch (error) {
      console.error("Error fetching data", error);
      setTime("Error fetching time");
    } finally {
      setIsLoading(false);
    }
  }, [appData.user.role]);

  const handleKickOut = useCallback(async (user: User) => {
    if (appData.user.role!='admin') return;
    setIsLoading(true);
    try {
      await userSvc.kickOut(user);
      window.location.href='/'
    } catch (error) {
      console.error("Error in handleKickOut", error);
    } finally {
      setIsLoading(false);
    }
  }, [appData.user.role]);


  useEffect(() => {
    if (appData.user.role) {
      getData();
    } else {
      setIsLoading(false);
    }
  }, [appData.user.role, time]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      {appData.user.role=='admin' ? (
        <>
          <h1 className="centered-title">Active Users Table</h1>
          <div className="table-container">
            <table id="users">
              <thead>
                <tr>
                  <th>Username/MobileNo</th>
                  <th>Role</th>
                  <th>Kick Out</th>
                </tr>
              </thead>
              <tbody>
                {userList.length > 0 ? (
                  userList.filter(user => user.username !== appData.user.username).map((user, idx) => (
                    <tr key={idx}>
                      <td>{user.username}</td>
                      <td>{user.role}</td>
                      <td>
                       {appData.user.username!=user.username &&<button onClick={() => handleKickOut(user)} >
                         {user.locked?'Un Block':'Kick Out'}
                        </button>}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3}>No active users</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <h1 className="centered-title">Welcome! Current time: {time}</h1>
      )}
    </>
  );
};

export default HomeComponent;