import { makeStyles } from '@material-ui/core/styles';
import Navbar from '../components/Navbar.js';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  }
}));

export default function Layout({ children }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      {/* Navigation */}
      <Navbar></Navbar>

      {/* Content */}
      {children}
    </div>
  );
}
