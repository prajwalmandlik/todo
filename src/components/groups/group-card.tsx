import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { ContentCopy, Delete, Edit } from "@mui/icons-material";

import CallMadeIcon from "@mui/icons-material/CallMade";
import DeleteGroup from "./group-delete";
import { Group } from "@/types/groups";
import GroupForm from "./group-form";
import Link from "next/link";
import React from "react";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";

type GroupCardProps = {
  data: Group;
};

const GroupCard: React.FC<GroupCardProps> = ({ data }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(data.inviteCode);
    toast.success("Group code copied to clipboard");
  };
  const { data: user } = useSession();
  return (
    <>
      <Grid item xs={12} sm={6} md={4}>
        <Card>
          <CardContent>
            <Link href={`/groups/${data.id}`}>
              <Stack
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexDirection: "row",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <Typography variant="h6" gutterBottom>
                  {data.name}
                </Typography>
                <CallMadeIcon />
              </Stack>
            </Link>
            <Typography variant="body1" color="text.secondary">
              Created by: {data.createdBy.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Members: {data.members.length}
            </Typography>
            <Typography
              variant="body2"
              sx={{ display: "flex", alignItems: "center", mt: 1 }}
            >
              Join Code: <strong>{data.inviteCode}</strong>
              <Tooltip title="Copy Join Code">
                <IconButton onClick={handleCopy} size="small" sx={{ ml: 1 }}>
                  <ContentCopy fontSize="small" />
                </IconButton>
              </Tooltip>
            </Typography>
            {user?.user?.id === data.createdBy.id && (
              <CardActions style={{ justifyContent: "end" }}>
                <GroupForm type="update" data={data} />
                <DeleteGroup id={data.id} />
              </CardActions>
            )}
          </CardContent>
        </Card>
      </Grid>
    </>
  );
};

export default GroupCard;
