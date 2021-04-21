import React from 'react';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DashboardIcon from '@material-ui/icons/Dashboard';
import GroupIcon from '@material-ui/icons/Group';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import MoneyOffIcon from '@material-ui/icons/MoneyOff';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import ScheduleIcon from '@material-ui/icons/Schedule';
import { useLocation } from 'react-router-dom';


const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(6) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(7) + 1,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));


function Navbar(props) {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const currentTab = (path) => {
    switch(path) {
      case '/': return "Dashboard";
      case '/attendance': return "Attendance";
      case '/employees': return "Employees";
      case '/positions': return "Positions";
      case '/deductions': return "Deductions";
      case '/payroll': return "Payroll";
      case '/schedules': return "Schedules";
      default: return;
    }
  }

  return (
    <>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: open,
            })}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            {currentTab(useLocation().pathname)}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >
        <div className={classes.toolbar}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </div>
        <Divider />
        <List>
          <Link to='/dashboard'>
            <ListItem button key='dashboard'>
              <ListItemIcon><DashboardIcon/></ListItemIcon>
              <ListItemText primary='Dashboard' />
            </ListItem>
          </Link>
        </List>
        <Divider />
        <List>
          <Link to={`/attendance`}>
            <ListItem button key='attendance'>
              <ListItemIcon><CalendarTodayIcon/></ListItemIcon>
              <ListItemText primary='Attendance'/>
            </ListItem>
          </Link>
          <Link to={`/employees`}>
            <ListItem button key='employees'>
              <ListItemIcon><GroupIcon/></ListItemIcon>
              <ListItemText primary="Employees"/>
            </ListItem>
          </Link>
          <Link to={`/positions`}>
            <ListItem button key='positions'>
              <ListItemIcon><PersonAddIcon/></ListItemIcon>
              <ListItemText primary='Positions' />
            </ListItem>
          </Link>
          <Link to={`/deductions`}>
          <ListItem button key='deductions'>
            <ListItemIcon><MoneyOffIcon/></ListItemIcon>
            <ListItemText primary='Deductions' />
          </ListItem>
        </Link>
        </List>
        <Divider />
        <List>
          <Link to={`/payroll`}>
            <ListItem button key='payroll'>
              <ListItemIcon><AttachMoneyIcon/></ListItemIcon>
              <ListItemText primary='Payroll' />
            </ListItem>
          </Link>
          <Link to={`/schedules`}>
            <ListItem button key='schedules'>
              <ListItemIcon><ScheduleIcon/></ListItemIcon>
              <ListItemText primary='Schedules' />
            </ListItem>
          </Link>
        </List>
        <Divider />
      </Drawer>
    </>
  );
}

export default Navbar;