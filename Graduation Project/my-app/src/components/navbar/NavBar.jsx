import React from 'react';
// import { Button } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
// import NavDropdown from 'react-bootstrap/NavDropdown';
import { NavLink } from 'react-router-dom';
import Avatar from './Avatar';
import NavBarSearch from './NavBarSearch';

const NavBar = () => {
    return (
        <>
            <Navbar bg="light" expand="lg">
                <Container>
                    <Navbar.Brand><NavLink to="/home">Cat News</NavLink></Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <NavLink to="/home" className="navbar-navigate">Home</NavLink>
                            <NavLink to="/news" className="navbar-navigate">News</NavLink>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
                <NavBarSearch />
                <Avatar size={50} img="data:image/jpeg;base64,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" />
            </Navbar>
        </>
    );
}

export default NavBar;
