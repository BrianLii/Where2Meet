import * as React from "react";

import Image from "next/image";

import StarRoundedIcon from "@mui/icons-material/StarRounded";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Fade from "@mui/material/Fade";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";

import { Button } from "@/components/ui/button";

type ModalProps = {
  rating: number | null;
  user: {
    id: string;
    displayName: string | null;
    image: string | null;
    intro: string | null;
    gender: string | null;
    height: number | null;
    weight: number | null;
    age: number | null;
  };
};

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 320,
  bgcolor: "background.paper",
  border: "2px solid #334155",
  boxShadow: 24,
  p: 4,
  borderRadius: "24px",
};

export default function CardModal(props: ModalProps) {
  const { user, rating } = props;
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div className="text-end">
      <Button onClick={handleOpen} className="bg-black/50 hover:bg-black/80">
        More
      </Button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Typography id="transition-modal-title" variant="h5" component="h2">
              {user.displayName}
            </Typography>
            <div className="mx-auto w-full">
              <div className="relative aspect-square w-full flex-none overflow-hidden rounded-md">
                <Image
                  src={user.image || "/images/placeholder.jpg"}
                  alt="user-profile-picture"
                  fill={true}
                  priority={true}
                  sizes="33vw"
                  style={{ objectFit: "contain" }}
                />
              </div>
            </div>
            <div className="text-end">
              <Chip
                icon={<StarRoundedIcon sx={{ color: "#facc15" }} />}
                label={rating == null ? "No one rated." : `${rating}`}
                className="mt-4 border border-black bg-white text-black"
                variant="outlined"
                sx={
                  rating !== null
                    ? {
                        "& .MuiSvgIcon-root": {
                          color: "#facc15",
                        },
                      }
                    : null
                }
              />
            </div>
            <Typography>Age: {user.age}</Typography>
            <Typography sx={{ mt: 0.5 }}>Height: {user.height}</Typography>
            <Typography sx={{ mt: 0.5 }}>Weight: {user.weight}</Typography>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
