import React from 'react'
import '../css/test.css'

const testpage = () => {
  return (
    <div>
       <header>
        <h1>Welcome to My Example Page</h1>
    </header>

    <nav>
        <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">About</a></li>
            <li><a href="#">Services</a></li>
            <li><a href="#">Contact</a></li>
        </ul>
    </nav>

    <main>
        <section>
            <h2>About Us</h2>
            <p>This is a simple example page to demonstrate basic HTML and CSS styling.</p>
        </section>

        <section>
            <h2>Our Services</h2>
            <p>We offer a variety of services to meet your needs.</p>
        </section>
    </main>

    <footer>
        <p>&copy; 2025 Example Page. All rights reserved.</p>
    </footer>
    </div>
  )
}

export default testpage
