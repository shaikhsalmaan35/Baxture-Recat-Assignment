// Import necessary modules and components
"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  Text,
  Group,
  Avatar,
  Anchor,
  Button,
  Grid,
  rem,
  Tooltip,
} from "@mantine/core";
import { IconTrash, IconUserPlus, IconUserMinus } from "@tabler/icons-react";
import {
  IconAt,
  IconPhoneCall,
  IconWorld,
  IconStar,
} from "@tabler/icons-react";
import classes from "./CardWithStats.module.css";

// Define the structure of user data
interface UserData {
  id: number;
  name: string | React.ReactElement;
  email: string;
  phone: string;
  website: string;
  isFollowed: boolean;
}

// Component for rendering the avatar section of each card
const CardSection: React.FC<{ user: UserData }> = ({ user }) => {
  return (
    <div
      className="card"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Avatar with larger size and circular shape */}
      <Tooltip withArrow label={user.name} style={{ cursor: "help" }}>
        <Anchor
          href={`https://${user.website}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Avatar
            size="xl"
            radius="50%"
            className={classes.largerAvatar}
            src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
          />
        </Anchor>
      </Tooltip>
    </div>
  );
};

// Component for rendering user details (email, phone, website)
const UserDetails: React.FC<{
  label: string;
  icon: React.ReactNode;
  value: string;
}> = ({ label, icon, value }) => {
  // Function to determine the link type based on the label
  const getLinkType = (label: string, value: string): string => {
    switch (label.toLowerCase()) {
      case "email:":
        return `mailto:${value}`;
      case "phone:":
        return `tel:${value}`;
      case "website:":
        return value.startsWith("http") ? value : `http://${value}`;
      default:
        return "";
    }
  };

  return (
    // Anchor tag with link type and styling
    <Anchor
      href={getLinkType(label, value)}
      target="_blank"
      underline="hover"
      fz="md"
      lh="sm"
      style={{ color: "gray", margin: "2px" }}
    >
      <span style={{ marginLeft: "8px", marginRight: "2px" }}> {icon} </span>

      <span>{value}</span>
    </Anchor>
  );
};

// Main component for rendering the homepage
const HomePage = () => {
  // State variables for user data and star icon
  const [names, setNames] = useState<UserData[]>([]);
  const [starIcon, setStarIcon] = useState(<IconStar size={15} />);

  // Function to fetch data from the API
  const fetchData = async () => {
    try {
      const response = await axios.get<UserData[]>(
        "https://jsonplaceholder.typicode.com/users"
      );
      setNames(response.data.map((user) => ({ ...user, isFollowed: false })));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Function to handle the follow button click
  const handleFollow = (id: number) => {
    setNames((prevNames) =>
      prevNames.map((user) =>
        user.id === id
          ? {
              ...user,
              name: user.isFollowed
                ? user.name.toString().replace("<IconStar/>", "")
                : user.name,
              isFollowed: !user.isFollowed,
            }
          : user
      )
    );
  };

  // Function to delete a card
  const deleteCard = async (id: number) => {
    try {
      await axios.delete(`https://jsonplaceholder.typicode.com/users/${id}`);
      setNames((prevNames) => prevNames.filter((user) => user.id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // useEffect hook to fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Render the list of cards with user data
  return (
    <div className={classes.cardContainer}>
      {names.map((user) => (
        <Card
          key={user.id}
          withBorder
          shadow="md"
          className={`${classes.card} ${classes.customCardSize}`}
        >
          {/* Avatar section */}
          <CardSection user={user} />

          {/* Group for displaying user name */}
          <Group
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* User name with star icon if followed */}
            <Text size="lg" ta="center" fw={500}>
              {user.isFollowed ? (
                <>
                  {user.name} {starIcon}
                </>
              ) : (
                user.name
              )}
            </Text>
          </Group>

          {/* User details components for email, phone, and website */}
          <UserDetails
            label="Email:"
            icon={<IconAt stroke={1.5} size={15} />}
            value={user.email}
          />
          <UserDetails
            label="Phone:"
            icon={<IconPhoneCall stroke={1.5} size={15} />}
            value={user.phone}
          />
          <UserDetails
            label="Website:"
            icon={<IconWorld stroke={1.5} size={15} />}
            value={user.website}
          />

          {/* Button container for Follow and Delete buttons */}
          
            {/* Group for button styling */}
            <Group gap="xs" grow style={{padding:"var(--mantine-spacing-xs)"}}>
              {/* Follow button with dynamic variant and text */}

              <Button
                className={classes.customButton}
                variant={user.isFollowed ? "default" : "filled"}
                size="sm"
                radius="sm"
                onClick={() => handleFollow(user.id)}
              >
                {/* Icon for Follow/Unfollow */}
                {user.isFollowed ? (
                  <IconUserMinus size={15} style={{ marginRight: "8px" }} />
                ) : (
                  <IconUserPlus size={15} style={{ marginRight: "8px" }} />
                )}
                {/* Text for Follow/Unfollow */}
                <Grid
                  gutter={{ base: 5, xs: "md", md: "xl", xl: 50 }}
                  style={{ marginLeft: "5px" }}
                >
                  <Grid.Col span={6}>
                    {user.isFollowed ? "Unfollow" : "Follow"}
                  </Grid.Col>
                </Grid>
              </Button>

              {/* Delete button with icon and text */}
              <Button
                className={classes.customButton}
                variant="outline"
                size="sm"
                radius="sm"
                onClick={() => deleteCard(user.id)}
              >
                <IconTrash size={15} style={{ marginRight: "8px" }} />
                <Text>Delete</Text>
              </Button>
            </Group>
         
        </Card>
      ))}
    </div>
  );
};

// Export the component
export default HomePage;
