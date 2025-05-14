import SideBar from "../components/Sidebar";
import Container from "../components/Container";
import AccountContainer from "../components/SectionContainer";

function Favorites() {

    return (
        <>
            <SideBar />
            <Container>
                <AccountContainer>
                    <h1>Pagina de favoritos</h1>
                </AccountContainer>
            </Container>
        </>
    )
}

export default Favorites