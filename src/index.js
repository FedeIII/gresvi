import 'core-js/stable';
import 'regenerator-runtime/runtime';
import ReactDOM from 'react-dom';
import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from 'react-three-fiber';
import GitHub from 'github-api';
import styled from 'styled-components';

// GITHUB

let gh;
let repository;

async function getCommits() {
  // const me = gh.getUser();
  // const { data: reposData } = await me.listRepos({ type: 'owner' });
  // const repo = reposData.find(rep => rep.name === 'hidden-agenda');
  const { data } = await repository.listCommits();
  return data;
}

async function getFiles(commits) {
  const filesRequests = commits.map(commit =>
    repository.getSingleCommit(commit.sha),
  );
  const files = (await Promise.all(filesRequests)).map(
    ({ data }) => data.files,
  );

  return files;
}

(async function() {
  gh = new GitHub({
    token: '125a1453c719883490eae62e3636447c478104e9',
  });

  repository = gh.getRepo('FedeIII', 'hidden-agenda');

  const commits = await getCommits();
  const files = await getFiles(commits);

  console.log(files);
})();

// CUBE

function Cube({ color, position }) {
  const ref = useRef();
  let rotationSpeed = 0.04;
  useEffect(() => {
    rotationSpeed = 0.04 * Math.random();
  }, []);
  useFrame(
    () => (ref.current.rotation.x = ref.current.rotation.y += rotationSpeed),
  );

  return (
    <mesh
      ref={ref}
      onClick={e => console.log('click')}
      onPointerOver={e => console.log('hover')}
      onPointerOut={e => console.log('unhover')}
      position={position}
    >
      <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
      <meshPhongMaterial attach="material" color={color} />
    </mesh>
  );
}

// CANVAS

const StyledCanvas = styled(Canvas)`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: slategray;
`;

function ResponsiveCanvas({ children }) {
  const ref = useRef();
  let aspect = 16 / 9;

  useEffect(() => {
    aspect = ref.clientWidth / ref.clientHeight;
  }, []);

  const camera = {
    fov: 75,
    aspect: 1,
    near: 0.1,
    far: 1000,
    aspect,
  };

  // useFrame(() => camera.updateProjectionMatrix());

  return (
    <StyledCanvas ref={ref} camera={camera}>
      {children}
    </StyledCanvas>
  );
}

function App() {
  return (
    <ResponsiveCanvas>
      <Cube color="#44aa88" position={[0, 1, 1]} />
      <Cube color="#8844aa" position={[-2, 1, 1]} />
      <Cube color="#aa8844" position={[2, 1, 1]} />
      <directionalLight color="#FFFFFF" intensity={1} position={[-1, 2, 4]} />
    </ResponsiveCanvas>
  );
}

ReactDOM.render(<App />, document.getElementById('game'));
