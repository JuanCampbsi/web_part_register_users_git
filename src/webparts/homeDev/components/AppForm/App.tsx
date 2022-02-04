import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import swal from 'sweetalert';

import '../../../../stylelibrary/css/global.css';
import './App.css';
import '../../../../stylelibrary/css/Sidebar.css';
import '../../../../stylelibrary/css/Main.css';

import DevItem from '../DevItem';
import { sp } from '@pnp/sp';

export const App: React.FunctionComponent = () => {

  const [devs, setDevs] = useState([]);
  const [latitude, setLatitude] = React.useState('');
  const [longitude, setLogintude] = React.useState('');
  const [github_username, setGitHubUserName] = React.useState('');
  const [techs, setTechs] = React.useState('');

  useEffect(() => {
    async function loadDevs() {
      sp.web.lists
        .getByTitle("Devs")
        .select("ID, name, githubUsername, techs, avatarUrl, bio")
        .items.top(5000)
        .get()
        .then(items => {
          setDevs(items);
        },
        (err) => {
          console.log(err);
        });
    }
    loadDevs();

  }, []);


  async function handleAddDev(e) {
    e.preventDefault();

    const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);
    const { name, avatar_url, bio } = apiResponse.data;

    sp.web.lists.getByTitle("Devs").items.add({
      githubUsername: github_username,
      name: name,
      avatarUrl: avatar_url,
      bio: bio,
      techs: techs,
      latitude: latitude,
      longitude: longitude
    }).then(i => {
        setDevs([...devs, i.data]);
        setGitHubUserName('');
        setTechs('');
        swal({
          title: "Sucesso",
          text: "Cadastros efetuado com sucesso!",
          icon: "success",
          buttons: [false, "Ok"],
          dangerMode: true,
      });
    },
    (err) => {
      swal({
        title: "Erro ao cadastrar!",
        text: `Ocorreu o seguinte erro: ${err}`,
        icon: "error",
        buttons: [false, "Ok"],
        dangerMode: true,
      });
    });

  }

  return (
    <div id="app">
      <aside>
        <strong>Register</strong>
        <form onSubmit={handleAddDev}>
            <div className="input-block">
                <label htmlFor="github_username">GitHub UserName</label>
                <input name="github_username" id="github_username" required
                    value={github_username}
                    onChange={e => setGitHubUserName(e.target.value)} />
            </div>

            <div className="input-block">
                <label htmlFor="techs">Technologies</label>
                <input name="techs" id="techs" required
                    value={techs}
                    onChange={e => setTechs(e.target.value)} />
            </div>

            <div className="input-group">
                <div className="input-block">
                    <label htmlFor="latitude">Latitude</label>
                    <input type="number" name="latitude" id="latitude" required
                        value={latitude}
                        onChange={e => setLatitude(e.target.value)} />
                </div>
                <div className="input-block">
                    <label htmlFor="longitude">Longitude</label>
                    <input type="number" name="longitude" id="longitude" required
                        value={longitude}
                        onChange={e => setLogintude(e.target.value)} />
                </div>
            </div>

            <button type="submit">Save</button>
        </form>
      </aside>
      <main>
        <ul>
          {devs.map(dev => (
            <DevItem key={dev.ID} dev={dev} />
          ))}
        </ul>
      </main>
    </div>
  );

};
