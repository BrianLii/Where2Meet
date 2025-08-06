"use client";

import { useEffect } from "react";
import { useState } from "react";

import Image from "next/image";
import Link from "next/link";

import FavoriteIcon from "@mui/icons-material/Favorite";
import SentimentVeryDissatisfiedRoundedIcon from "@mui/icons-material/SentimentVeryDissatisfiedRounded";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";

import CardModal from "./CardModal";

type CardProps = {
  userId: string;
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

export default function RecipeReviewCard(props: CardProps) {
  const userInfo = props.user;
  const [isLike, setIsLike] = useState(false);
  const [isDislike, setIsDislike] = useState(false);
  const [isPair, setIsPair] = useState(false);
  const [currentRating, setCurrentRating] = useState<number | null>(null);

  // api
  useEffect(() => {
    fetch(`/api/islike?likerId=${props.userId}&likedId=${userInfo.id}`)
      .then((response) => response.json())
      .then((data) => setIsLike(data.isLike));
  }, [props.userId, userInfo.id]);

  useEffect(() => {
    fetch(`/api/isdislike?dislikerId=${props.userId}&dislikedId=${userInfo.id}`)
      .then((response) => response.json())
      .then((data) => setIsDislike(data.isDisike));
  }, [props.userId, userInfo.id]);

  useEffect(() => {
    fetch(`/api/ispair?userId=${props.userId}&otherId=${userInfo.id}`)
      .then((response) => response.json())
      .then((data) => {
        setIsPair(data.isPair);
        setCurrentRating(data.rating ?? 0);
      });
  }, [props.userId, userInfo.id, isLike, isDislike]);

  useEffect(() => {
    fetch(`/api/rating?userId=${userInfo.id}`)
      .then((response) => response.json())
      .then((data) => setCurrentRating(data.averageRating));
  }, [props.userId, userInfo.id]);

  const handleLikeClick = async () => {
    if (isDislike) {
      await fetch(`/api/dislikes`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dislikerId: props.userId,
          dislikedId: userInfo.id,
        }),
      });
      setIsDislike(false);
    }
    if (isLike) {
      await fetch(`/api/likes`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          likerId: props.userId,
          likedId: userInfo.id,
        }),
      });
      setIsLike(false);
      setIsPair(false);
    } else {
      await fetch(`/api/likes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          likerId: props.userId,
          likedId: userInfo.id,
        }),
      });
      setIsLike(true);
    }
  };

  const handleDislikeClick = async () => {
    if (isLike) {
      await fetch(`/api/likes`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          likerId: props.userId,
          likedId: userInfo.id,
        }),
      });
      setIsLike(false);
      setIsPair(false);
    }
    if (isDislike) {
      await fetch(`/api/dislikes`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dislikerId: props.userId,
          dislikedId: userInfo.id,
        }),
      });
      setIsDislike(false);
    } else {
      await fetch(`/api/dislikes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dislikerId: props.userId,
          dislikedId: userInfo.id,
        }),
      });
      setIsDislike(true);
      setIsPair(false);
    }
  };

  const handleRating = async (newValue: number) => {
    await fetch(`/api/likes`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        likerId: props.userId,
        likedId: userInfo.id,
        rating: newValue,
      }),
    });
    setCurrentRating(newValue);
  };

  return (
    <Card sx={{ maxWidth: 300 }} className="mx-auto">
      <Link href={`/profile/${userInfo.id}`}>
        <div className="relative aspect-square w-full flex-none overflow-hidden rounded-md">
          <Image
            src={userInfo.image || "/images/placeholder.jpg"}
            alt="user-profile-picture"
            fill={true}
            priority={true}
            sizes="33vw"
            style={{ objectFit: "contain" }}
          />
        </div>
      </Link>
      <CardContent>
        <Typography variant="h5">{userInfo.displayName}</Typography>
        <Typography variant="h6">{userInfo.gender}</Typography>
        <CardModal user={userInfo} rating={currentRating} />
      </CardContent>
      <CardActions disableSpacing className="flex flex-wrap">
        <IconButton aria-label="add to likes" onClick={handleLikeClick}>
          <FavoriteIcon sx={{ color: isLike ? "#e11d48" : undefined }} />
        </IconButton>
        <IconButton aria-label="add to dislikes" onClick={handleDislikeClick}>
          <SentimentVeryDissatisfiedRoundedIcon
            sx={{ color: isDislike ? "#15803d" : undefined }}
          />
        </IconButton>
        <div>
          <Rating
            name="half-rating"
            value={currentRating}
            precision={0.5}
            onChange={(event, newValue) => handleRating(newValue ?? 0)}
            {...(isPair ? undefined : { disabled: true })}
          />
        </div>
      </CardActions>
    </Card>
  );
}
